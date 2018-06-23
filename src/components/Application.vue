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
      <form v-on:submit.prevent>
        <div class="form-group">
          <label for="game-username-input">Enter your Username to start the Game</label>
          <input type="text"
                 id="game-username-input"
                 class="form-control"
                 placeholder="Enter your username"
                 v-model="inputUsername"
          >
          <small class="form-text text-muted">Please use at least 3 characters.</small>
        </div>

        <button class="btn btn-success"
                @click="startGame"
                :disabled="isUsernameInvalid"
        >
          Start Game!
        </button>
      </form>
    </div>

  </div>
</template>

<script>
import MatchClient from '../services/match/matchClient'
import { mapGetters, mapMutations } from 'vuex'

export default {
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
      inputUsername: '',
      messages: [],
      moves: [],

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
    }),

    /**
     * @returns {boolean}
     */
    isUsernameInvalid: function () {
      return this.inputUsername.length < 3
    }
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

    startGame() {
      this.username = this.inputUsername
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
        } else {
          this.match.nextTurnPlayer = this.match.player1
        }
      }
    })

    this.registerEvent({
      event: 'next_move_announce',
      callback: (data) => {
        console.log('GOT next_move_announce EVENT', data)

        const { number, player } = data

        if (number === 1 && player === this.userId) {
          alert('You have won')
          return;
        } else if (number === 1 && player !== this.userId) {
          alert('You have lost')
          return;
        }

        // Check whether the User is the next Player
        console.log('check if I must move', player, this.userId, player === this.userId)

        if (player === this.userId) {
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
        } else {
          this.updateTurn(number)
        }
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.moves-container {
  margin-top: 1em;
}
</style>
