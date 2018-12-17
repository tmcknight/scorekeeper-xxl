import React, { Component } from "react"
import { FaMinus, FaPlus } from "react-icons/fa"
import EditPlayerModal from "./EditPlayerModal"
import { colors } from "./App"

export default class Player extends Component {
  constructor(props) {
    super(props)

    this.state = {
      adjustmentAmount: 0,
      isAdjusting: false,
      showEditModal: false
    }
  }

  increaseScore = () => {
    clearTimeout(this.commitChange)
    this.props.onAdjustingScore(this.props.player.id)
    this.setState(
      {
        isAdjusting: true,
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
        isAdjusting: true,
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
      isAdjusting: false,
      adjustmentAmount: 0
    })
    this.props.onScoreChange(this.props.player.id, newScore)
  }

  handleSave = (name, colorIndex) => {
    this.props.onSave(this.props.player.id, name, colorIndex)
    this.hideEditModal()
  }

  showEditModal = () => {
    this.setState({
      showEditModal: true
    })
  }

  hideEditModal = () => {
    this.setState({
      showEditModal: false
    })
  }

  handleRemove = () => {
    this.hideEditModal()
    this.props.onRemove(this.props.player.id)
  }

  render() {
    const { colorIndex, name, score } = this.props.player
    const { isAdjusting, adjustmentAmount } = this.state
    const sign =
      adjustmentAmount >= 0 ? <FaPlus size={20} /> : <FaMinus size={20} />
    const newScore = score + adjustmentAmount

    const style = {
      background: colors[colorIndex]
    }
    return (
      <div className="player" style={this.props.style}>
        <button className="name" style={style} onClick={this.showEditModal}>
          {name}
        </button>
        <div className="score" style={style}>
          {isAdjusting ? (
            <>
              <span className="small">
                {score} {sign}{" "}
              </span>
              {Math.abs(adjustmentAmount)}{" "}
              <span className="small"> = {newScore}</span>
            </>
          ) : (
            <>{score}</>
          )}
        </div>
        <button style={style} onClick={() => this.decreaseScore()}>
          <FaMinus />
        </button>
        <button style={style} onClick={() => this.increaseScore()}>
          <FaPlus />
        </button>

        <EditPlayerModal
          name={this.props.player.name}
          selectedColorIndex={this.props.player.colorIndex}
          show={this.state.showEditModal}
          onHide={this.hideEditModal}
          onSave={this.handleSave}
          onRemove={this.handleRemove}
        />
      </div>
    )
  }
}
