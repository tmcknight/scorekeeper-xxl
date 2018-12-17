import React, { Component } from "react"
import { Modal } from "react-overlays"
import { FaCheck, FaSkull } from "react-icons/fa"
import { colors } from "./App"

export default class EditPlayerModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedColorIndex: props.selectedColorIndex,
      name: props.name || ""
    }
  }

  changeColor = selectedColorIndex => {
    this.setState({
      selectedColorIndex
    })
  }

  colorButtons = () => {
    return colors.map((c, i) => {
      return (
        <button
          className="btn-player-color"
          key={i}
          style={{
            backgroundColor: c,
            margin: i === this.state.selectedColorIndex ? "5px" : null
          }}
          onClick={() => this.changeColor(i)}
        >
          &nbsp;
        </button>
      )
    })
  }

  handleNameChange = e => {
    this.setState({
      name: e.target.value
    })
  }

  handleNameKeyPress = e => {
    if (e.key === "Enter") {
      return this.props.onSave(this.state.name, this.state.selectedColorIndex)
    }
  }

  render() {
    const colorButtons = this.colorButtons()
    const selectedColor = colors[this.state.selectedColorIndex]

    return (
      <Modal
        show={this.props.show}
        backdropClassName="backdrop"
        onHide={this.props.onHide}
      >
        <div className="dialog">
          <div className="add-player">
            {colorButtons}
            <button
              className="btn-player-cancel"
              style={{ backgroundColor: selectedColor }}
              onClick={this.props.onRemove}
            >
              <FaSkull />
            </button>
            <input
              type="text"
              className="txt-add-player"
              style={{ backgroundColor: selectedColor }}
              value={this.state.name}
              onChange={this.handleNameChange}
              onKeyPress={this.handleNameKeyPress}
              autoFocus
            />
            <button
              className="btn-player-add"
              style={{ backgroundColor: selectedColor }}
              onClick={() =>
                this.props.onSave(
                  this.state.name,
                  this.state.selectedColorIndex
                )
              }
            >
              <FaCheck />
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}
