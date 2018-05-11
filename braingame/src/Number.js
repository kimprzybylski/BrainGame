import React, { Component } from 'react';

class Number extends Component {
    handleClick = () => {
        if (this.props.clickable) {
            this.props.onClick(this.props.id);
        }
    };

    render() {
        return <button className="number" onClick={this.handleClick} style={{ opacity: this.props.clickable ? 1 : 0.7 }}>
            {this.props.value}
            </button>
    }
}

export default Number

