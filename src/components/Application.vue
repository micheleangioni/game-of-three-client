<template>
  <div class="">

    <div v-if="user" class="player-info">
      Player: {{ user.username }} | Score: {{ user.won }} wins out of {{ user.played }}
    </div>

    <div class="messages-container row" v-show="user">
      <ul class="col col-xs-12 offset-sm-1 col-sm-10 offset-md-2 col-md-8 offset-lg-3 col-lg-6">
        <li class="list-group-item notification-container">Notifications</li>

        <li class="list-group-item" v-show="messages.length === 0">

        </li>

        <li class="list-group-item"
            v-for="(message, index) in messages" :key="`${index}`"
        >
          {{ message }}
        </li>
      </ul>
    </div>

    <div class="moves-container" v-if="match.nextTurnPlayer" v-show="user">
      <div class="row">
        <div class="next-turn-text col col-xs-12 offset-sm-1 col-sm-10 offset-md-2 col-md-8 offset-lg-3 col-lg-6">
          <span v-show="match.nextTurnPlayer.username">
            Next Turn: {{ match.nextTurnPlayer.username }}
          </span>
        </div>
      </div>

      <div class="row">
        <ul class="col col-xs-12 offset-sm-1 col-sm-10 offset-md-2 col-md-8 offset-lg-3 col-lg-6">
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
    </div>

    <div class="start-game-container" v-show="user">
      <game-settings v-on:start_game="startGame"></game-settings>
    </div>

  </div>
</template>

<script>
  import GameSettings from '../common/GameSettings'
  import MatchClient from '../services/match/matchClient'
  import { mapGetters, mapMutations } from 'vuex'
  import router from '../router/index'
  import swal from 'sweetalert'

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
         * Whether the User has been queued for a game.
         */
        queued: false,

        /**
         * Game style.
         */
        style: 'auto',

        /**
         * User Player Id.
         */
        userId: null
      }
    },

    computed: {
      ...mapGetters('user', {
        socket: 'getSocket',
        user: 'getUser'
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
        registerEvent: 'registerSocketEvent',
        updateUser: 'updateUserMatches'
      }),

      /**
       * Save the chosen style and emit the sockets 'start_game' event.
       */
      startGame({ style }) {
        this.style = style
        this.socket.emit('start_game')
      },

      /**
       * Update the turn to next turn.
       *
       * @param {number} number
       */
      updateTurn(number) {
        this.moves.push(this._generateMoveMessage(number))
        this.match.number = number

        let temp = this.match.currentTurnPlayer
        this.match.currentTurnPlayer = this.match.nextTurnPlayer
        this.match.nextTurnPlayer = temp
      },

      /**
       * Generate a message for the next move.
       *
       * @param {number} number
       */
      _generateMoveMessage(number) {
        if (this.match.number > 0) {
          const addedNumber = (number * 3) - this.match.number

          return {
            player: this.match.currentTurnPlayer.username,
            added: addedNumber,
            number: number
          }
        } else {
          return {
            player: this.match.currentTurnPlayer.username,
            added: 0,
            number: number
          }
        }
      },

      /**
       * Open the Move Modal.
       *
       * @param {number} number
       * @param {boolean} newTry
       */
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
                break

              case 'zero':
                summedNumber = number
                break

              case 'minus':
                summedNumber = number - 1
                break

              default:
                console.log('Wrong choice')
            }

            if (summedNumber % 3 !== 0) {
              swal('error')
              this._openMoveModal(number, true)
              return
            }

            const nextNumber = summedNumber / 3

            this.updateTurn(number)

            // Send the next move
            setTimeout(() => {
              this.socket.emit('next_move', {
                match_id: this.match.match_id,
                number: nextNumber
              })
            }, 500)
          })
      },

      /**
       * Reset the Game.
       *
       * @private
       */
      _resetGame() {
        this.queued = false
        this.messages = []
        this.moves = []
        this.match = {
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
        }
      }
    },

    created () {
      if (!this.user) {
        router.push({ name: 'Home'})
      }

      // Initialize socket connection
      if (!this.socket) {
        this.initialize(localStorage.getItem('access_token'))
      }

      this.registerEvent({
        event: 'queued',
        callback: () => {
          this.queued = true
          this.messages.push('You have been queued, please wait')
        }
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
          const { number, player } = data
          // Check whether the User is the next Player

          if (player === this.userId && this.style === 'auto') {
            const nextNumber = MatchClient.computeNextMoveNumber(number)
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

      this.registerEvent({
        event: 'game_won',
        callback: () => {
          this.updateUser({ played: this.user.played + 1, won: this.user.won + 1 })
          swal('You won!', 'Play another match! ;)')
            .then((value) => {
              this._resetGame()
            });
        }
      })

      this.registerEvent({
        event: 'game_lost',
        callback: () => {
          this.updateUser({ played: this.user.played + 1, won: this.user.won })
          swal('You lost :(', '... but you can play again! ;)')
            .then((value) => {
              this._resetGame()
            });
        }
      })

      this.registerEvent({
        event: 'app_error',
        callback: ({ error }) => {
          this.messages.push(error)
        }
      })
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../variables';

.player-info {
  margin: 1em 0 2em 0;
}

.moves-container {
  margin-top: 1em;

  .next-turn-text {
    margin-bottom: 0.2em;
  }
}

.notification-container {
  background-color: $takeaway-primary-color;
  color: white;
}
</style>
