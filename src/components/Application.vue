<template>
  <div class="container">

    <div v-if="match.match_id">Player: {{ username }} <span v-if="userId">{{userId}}</span></div>

    <div class="messages-container" v-show="username">
      <ul class="list-group">
        <li class="list-group-item disabled active">Messages</li>

        <li class="list-group-item" v-show="messages.length === 0">

        </li>

        <li class="list-group-item"
            v-for="(message, index) in messages" :key="`${index}`"
        >
          {{ message }}
        </li>
      </ul>
    </div>

    <div class="moves-container" v-if="match.nextTurnPlayer" v-show="username">
      <div>Next Turn: {{ match.nextTurnPlayer.username }}</div>

      <ul class="list-group">
        <li class="list-group-item disabled">Player moves</li>
        <li class="list-group-item"
            v-for="(move, index) in moves" :key="`${index}`"
        >
          <span v-if="move.number && move.number > 0">
            <b>{{move.player}}</b> : adding {{move.added}} and got: {{ move.number }}
          </span>

          <span v-if="!move.number">
            <b>{{move.player}}</b> : First round, starting with: {{ move.number }}
          </span>
        </li>
      </ul>
    </div>

    <div class="start-game-container" v-show="!username">
      <game-settings v-on:start_game="startGame"></game-settings>
    </div>

  </div>
</template>

<script>
  import GameSettings from '../common/GameSettings'
  import MatchClient from '../services/match/matchClient'
  import { mapGetters, mapMutations } from 'vuex'
  import swal from 'sweetalert';

  export default {
    components: {
      GameSettings
    },

    name: 'Application',

    data () {
      return {
        match: {
          match_id: null,
          player1: {
            id: null,
            username: null
          },
          player2: {
            id: null,
            username: null
          },
          number: 0,
          currentTurnPlayer: {
            id: null,
            username: null
          },
          nextTurnPlayer: {
            id: null,
            username: null
          }
        },
        messages: [],
        moves: [],

        /**
         * Game style.
         */
        style: 'auto',

        /**
         * User Player Id.
         */
        userId: null,

        /**
         * User Username.
         */
        username: ''
      }
    },

    computed: {
      ...mapGetters('user', {
        socket: 'getSocket'
      })
    },

    watch: {
      messages: function (messages) {
        // Let's delete old messages
        if (messages.length > 3) {
          this.messages = messages.slice(0, 3)
        }
      }
    },

    methods: {
      ...mapMutations('user', {
        initialize: 'init',
        registerEvent: 'registerSocketEvent'
      }),

      startGame({ style, username}) {
        this.style = style
        this.username = username
        this.socket.emit('start_game', this.username)
      },

      /**
       * Update the turn to next turn.
       *
       * @param {number} number
       */
      updateTurn(number) {
        this.moves.push(this._generateMoveMessage(number))

        // TODO Update VARIABLES
        this.match.number = number

        let temp = this.match.currentTurnPlayer
        this.match.currentTurnPlayer = this.match.nextTurnPlayer
        this.match.nextTurnPlayer = temp
      },

      _generateMoveMessage(number) {
        if (this.match.number > 0) {
          const addedNumber = (number * 3) - this.match.number

          console.log('generating message', `old: ${this.match.number}`, `new: ${number}`, `added: ${addedNumber}`)

          return {
            player: this.match.currentTurnPlayer.username,
            added: addedNumber,
            number: number
          }
        } else {
          console.log('generating message for first round', `new: ${number}`)
          return {
            player: this.match.currentTurnPlayer.username,
            added: 0,
            number: number
          }
        }
      },

      _openMoveModal(number, newTry = false) {
        let text

        if (newTry) {
          text = `Wrong choice! You must choose a number which can be divided by 3. You got ${number}. Pick a choice:`
        } else {
          text = `It's your turn! You got ${number}. Pick a choice:`
        }

        swal(text, {
          buttons: {
            add: {
              text: 'Add 1',
              value: 'add',
            },
            zero: {
              text: 'Add nothing',
              value: 'zero',
            },
            minus: {
              text: 'Subtract 1',
              value: 'minus',
            }
          },
        })
          .then(value => {
            let summedNumber

            switch (value) {

              case 'add':
                summedNumber = number + 1
                break;

              case 'zero':
                summedNumber = number
                break;

              case 'minus':
                summedNumber = number - 1
                break;

              default:
                console.log('Wrong choice')
            }

            if (summedNumber % 3 !== 0) {
              swal('error')
              this._openMoveModal(number, true)
              return
            }

            const nextNumber = summedNumber / 3

            console.log('MY NEXT MOVE: GOT ' + number + ', my move is ' + nextNumber)

            this.updateTurn(number)

            // Send the next move
            setTimeout(() => {
              this.socket.emit('next_move', {
                match_id: this.match.match_id,
                number: nextNumber
              })
            }, 500)
          });
      }
    },

    created () {
      // Initialize socket connection
      if (!this.socket) {
        this.initialize()
      }

      this.registerEvent({
        event: 'queued',
        callback: () => this.messages.push('You have been queued, please wait')
      })

      this.registerEvent({
        event: 'game_started',
        callback: data => {
          this.messages.push('The game will soon start! Prepare yourself!!')
          this.match = { ...this.match, ...data }

          setTimeout(() => {
            this.messages = []
          }, 2000)
        }
      })

      this.registerEvent({
        event: 'first_turn',
        callback: ({ player }) => {
          this.userId = player

          if (this.match.player1.id === player) {
            this.match.nextTurnPlayer = this.match.player1
            this.match.currentTurnPlayer = this.match.player2
          } else {
            this.match.nextTurnPlayer = this.match.player2
            this.match.currentTurnPlayer = this.match.player1
          }

          const startingNumber = MatchClient.initiateNumber()

          // Send the first move
          console.log('SEND NEXT_MOVE EVENT')

          this.socket.emit('next_move', {
            match_id: this.match.match_id,
            number: startingNumber
          })
        }
      })

      this.registerEvent({
        event: 'first_turn_wait',
        callback: ({ player }) => {
          this.userId = player

          if (this.match.player1.id === player) {
            this.match.nextTurnPlayer = this.match.player2
            this.match.currentTurnPlayer = this.match.player1
          } else {
            this.match.nextTurnPlayer = this.match.player1
            this.match.currentTurnPlayer = this.match.player2
          }
        }
      })

      this.registerEvent({
        event: 'next_move_announce',
        callback: (data) => {
          console.log('GOT next_move_announce EVENT', data)

          const { number, player } = data

          if (number === 1 && player === this.userId) {
            alert('You have lost')
            return;
          } else if (number === 1 && player !== this.userId) {
            alert('You have won')
            return;
          }

          // Check whether the User is the next Player
          console.log('check if I must move', player, this.userId, player === this.userId)

          if (player === this.userId && this.style === 'auto') {
            const nextNumber = MatchClient.computeNextMoveNumber(number)

            console.log('MY NEXT MOVE: GOT ' + number + ', my move is ' + nextNumber)

            this.updateTurn(number)

            // Send the next move
            setTimeout(() => {
              this.socket.emit('next_move', {
                match_id: this.match.match_id,
                number: nextNumber
              })
            }, 500)
          } else if (player === this.userId && this.style === 'manual') {
            this._openMoveModal(number)
          } else {
            this.updateTurn(number)
          }
        }
      })
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .moves-container {
    margin-top: 1em;
  }
</style>
