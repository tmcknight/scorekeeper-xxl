import React, { Component } from "react"
import Player from "./Player"
import "./App.css"
import {
  FaUserPlus,
  FaVolume,
  FaRedoAlt,
  FaSortNumericUp,
  FaSortNumericDown,
  FaVolumeMute
} from "react-icons/fa"
import EditPlayerModal from "./EditPlayerModal"
import { Transition } from "react-spring"

export const colors = [
  "#FE4545",
  "#FF8822",
  "#FFFF33",
  "#66FD34",
  "#66FECD",
  "#2F88FE",
  "#AA54FF",
  "#FF88FE",
  "#A8A8A8",
  "#F6F6F6"
]

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showAddPlayer: false,
      sortDescending: true,
      soundOn: true,
      players: [
        { id: 0, name: "Tom", score: 0, colorIndex: 0 },
        { id: 1, name: "Jess", score: 0, colorIndex: 6 },
        { id: 2, name: "Eli", score: 0, colorIndex: 1 },
        { id: 3, name: "Sawyer", score: 0, colorIndex: 5 },
        { id: 4, name: "Evelyn", score: 0, colorIndex: 7 }
      ],
      adjustingScoreIds: []
    }
  }

  showAddPlayer = () => {
    this.setState({
      newPlayerColorIndex: this.getLeastUsedColorIndex(),
      showAddPlayer: true
    })
  }

  startedAdjustingScore = id => {
    clearTimeout(this.sortPlayersHandle)
    this.setState({
      adjustingScoreIds: [...this.state.adjustingScoreIds, id]
    })
  }

  hideAddPlayer = () => {
    this.setState({
      showAddPlayer: false
    })
  }

  removePlayer = id => {
    this.setState({
      players: this.state.players.filter(p => p.id !== id)
    })
  }

  addPlayer = (playerName = "New Player", selectedColorIndex) => {
    const id = +new Date()
    const newPlayer = {
      id,
      score: 0,
      name: playerName,
      colorIndex: selectedColorIndex
    }
    this.setState({
      players: [...this.state.players, newPlayer],
      showAddPlayer: false
    })
  }

  getLeastUsedColorIndex = () => {
    const colorUses = new Array(colors.length).fill(0)
    this.state.players.forEach(p => {
      colorUses[p.colorIndex]++
    })
    return colorUses.indexOf(Math.min(...colorUses))
  }

  handleScoreChange = (id, score) => {
    this.setState(
      state => {
        const players = state.players.map((p, i) => {
          if (id === p.id) {
            p.score = score
          }
          return p
        })
        return {
          players,
          adjustingScoreIds: state.adjustingScoreIds.filter(i => i !== id)
        }
      },
      () => {
        if (!this.state.adjustingScoreIds.length) {
          this.sortPlayersHandle = setTimeout(() => {
            this.sortPlayers()
          }, 500)
        }
      }
    )
  }

  toggleSort = () => {
    this.setState(
      {
        sortDescending: !this.state.sortDescending
      },
      () => this.sortPlayers()
    )
  }
  toggleSound = () => {
    this.setState({
      soundOn: !this.state.soundOn
    })
  }

  savePlayer = (id, name, colorIndex) => {
    this.setState(state => {
      const players = state.players.map((p, i) => {
        if (id === p.id) {
          p.name = name
          p.colorIndex = colorIndex
        }
        return p
      })
      return { players }
    })
  }

  sortPlayers = () => {
    const players = [].concat(this.state.players).sort((a, b) => {
      return this.state.sortDescending ? b.score - a.score : a.score - b.score
    })
    this.setState({
      players
    })
  }

  render() {
    return (
      <>
        <div className="sheet">
          <div className="buttons">
            <button onClick={() => this.showAddPlayer()}>
              <FaUserPlus size={75} />
            </button>
            <button onClick={() => ""}>
              <FaRedoAlt size={75} />
            </button>
          </div>

          <div className="scores">
            <Transition
              items={this.state.players}
              keys={p => p.id}
              from={{ opacity: 0 }}
              enter={{ opacity: 1 }}
              leave={{ opacity: 0 }}
            >
              {player => props => (
                <Player
                  key={player.id}
                  player={player}
                  onScoreChange={this.handleScoreChange}
                  onSave={this.savePlayer}
                  onRemove={this.removePlayer}
                  onAdjustingScore={this.startedAdjustingScore}
                  style={props}
                />
              )}
            </Transition>
          </div>

          <div className="buttons">
            <button onClick={this.toggleSort}>
              {this.state.sortDescending ? (
                <FaSortNumericUp size={75} />
              ) : (
                <FaSortNumericDown size={75} />
              )}
            </button>
            <button onClick={this.toggleSound}>
              {this.state.soundOn ? (
                <FaVolume size={75} />
              ) : (
                <FaVolumeMute size={75} />
              )}
            </button>
          </div>
        </div>

        {this.state.showAddPlayer && (
          <EditPlayerModal
            selectedColorIndex={this.state.newPlayerColorIndex || 0}
            show={true}
            onRemove={this.hideAddPlayer}
            onSave={this.addPlayer}
          />
        )}
      </>
    )
  }
}

export default App
