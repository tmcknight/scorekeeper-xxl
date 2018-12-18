import React, { Component } from "react"
import { TiMinus, TiPlus } from "react-icons/ti"
import { colors } from "./App"
import Color from "color"
import { IoIosRemoveCircle } from "react-icons/io"

export default class Player extends Component {
  constructor(props) {
    super(props)

    const { player } = props

    this.state = {
      adjustmentAmount: 0,
      isAdjustingScore: false,
      isEditing: player,
      name: player.name,
      colorIndex: player.colorIndex
    }

    this.btnIncrease = React.createRef()
    this.btnDecrease = React.createRef()
  }

  holdit(btn, action, start, speedup) {
    var t
    const originalStart = start

    var repeat = function() {
      action()
      t = setTimeout(repeat, start)
      start = start / speedup
    }

    btn.onmousedown = function() {
      repeat()
    }

    btn.onmouseup = function() {
      start = originalStart
      clearTimeout(t)
    }
    btn.onmouseleave = function() {
      start = originalStart
      clearTimeout(t)
    }
  }

  componentDidMount = () => {
    this.holdit(this.btnIncrease.current, this.increaseScore, 1000, 1.4)
    this.holdit(this.btnDecrease.current, this.decreaseScore, 1000, 1.4)
  }

  increaseScore = () => {
    clearTimeout(this.commitChange)
    this.props.onAdjustingScore(this.props.player.id)
    this.setState(
      {
        isAdjustingScore: true,
        adjustmentAmount: this.state.adjustmentAmount + 1
      },
      () => {
        this.commitChange = setTimeout(() => {
          this.updateScore()
        }, 3000)
      }
    )
  }

  decreaseScore = () => {
    clearTimeout(this.commitChange)
    this.props.onAdjustingScore(this.props.player.id)
    this.setState(
      {
        isAdjustingScore: true,
        adjustmentAmount: this.state.adjustmentAmount - 1
      },
      () => {
        this.commitChange = setTimeout(() => {
          this.updateScore()
        }, 3000)
      }
    )
  }

  updateScore = () => {
    const newScore = this.props.player.score + this.state.adjustmentAmount
    this.setState({
      isAdjustingScore: false,
      adjustmentAmount: 0
    })
    this.props.onScoreChange(this.props.player.id, newScore)
  }

  startEditing = () => {
    this.setState({
      isEditing: true
    })
  }

  endEditing = () => {
    this.setState({
      isEditing: false
    })
    this.props.onSave(
      this.props.player.id,
      this.state.name,
      this.props.player.colorIndex
    )
  }

  handleRemove = () => {
    this.props.onRemove(this.props.player.id)
  }

  handleNameChange = e => {
    this.setState({
      name: e.target.value
    })
  }

  scoreContent() {
    const { score } = this.props.player
    const { adjustmentAmount } = this.state
    const sign = adjustmentAmount >= 0 ? "+" : "-"
    const newScore = score + adjustmentAmount
    if (this.state.isAdjustingScore) {
      const items = [
        { key: 0, className: "small", text: `${score} ${sign} ` },
        { key: 1, text: Math.abs(adjustmentAmount) },
        { key: 2, className: "small", text: ` = ${newScore}` }
      ]

      return items.map(i => <span {...i}>{i.text}</span>)
    } else {
      return this.props.player.score
    }
  }

  render() {
    const { colorIndex, name, isEditing } = this.state
    const fontColor = Color(colors[colorIndex]).darken(0.8)

    const style = {
      background: colors[colorIndex],
      color: fontColor
    }
    return (
      <div className="player">
        {!name && (
          <button className="delete" style={style} onClick={this.handleRemove}>
            <IoIosRemoveCircle />
          </button>
        )}

        {isEditing ? (
          <input
            style={style}
            className="name"
            value={name}
            onBlur={this.endEditing}
            onChange={this.handleNameChange}
            autoFocus
          />
        ) : (
          <button className="name" style={style} onClick={this.startEditing}>
            {name}
          </button>
        )}

        <div className="score" style={style}>
          {this.scoreContent()}
        </div>
        <button className="change-score" style={style} ref={this.btnDecrease}>
          <TiMinus />
        </button>
        <button className="change-score" style={style} ref={this.btnIncrease}>
          <TiPlus />
        </button>
      </div>
    )
  }
}
