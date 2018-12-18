import React, { Component } from "react"
import Player from "./Player"
import "./App.css"
import { IoIosAddCircle } from "react-icons/io"
import PlayerList from "./PlayerList"

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

  addPlayer = (e, playerName = "New Player", selectedColorIndex) => {
    const id = +new Date()

    if (!selectedColorIndex) {
      selectedColorIndex = this.getLeastUsedColorIndex()
    }

    const newPlayer = {
      id,
      score: 0,
      name: playerName,
      colorIndex: selectedColorIndex,
      isEditing: true
    }
    this.setState({
      players: [...this.state.players, newPlayer]
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
        <div className="scores-container">
          <PlayerList
            className="scores"
            items={this.state.players}
            keys={p => p.id}
            heights={90}
            config={{ mass: 3, tension: 150, friction: 30 }}
          >
            {player => (
              <Player
                player={player}
                onScoreChange={this.handleScoreChange}
                onSave={this.savePlayer}
                onRemove={this.removePlayer}
                onAdjustingScore={this.startedAdjustingScore}
              />
            )}
          </PlayerList>
          <button className="add-player" onClick={this.addPlayer}>
            <IoIosAddCircle />
          </button>
        </div>
      </>
    )
  }
}

export default App
