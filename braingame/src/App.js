import React, { Component } from 'react';
import './App.css';
import Number from './Number'
import _ from 'lodash'

const colors = {
    new: 'lightblue',
    playing: 'deepskyblue',
    won: 'green',
    lost: 'red',
};

class App extends Component {
    size = 8;
    max = 9;
    numberOfButtons = 3;

    state = {
        status: 'new',
        remainingSeconds: this.props.seconds,
        selectedIds: []
    };

    buttonValues = Array
        .from({ length: this.size })
        .map(() => Math.floor(Math.random() * this.max) + 1);

    result = _.sum(_.sampleSize(this.buttonValues, this.numberOfButtons));

    componentDidMount() {
        if (this.props.autoPlay) {
            this.startGame();
        }
    }
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    isNumberAvailable = numberIndex => this.state.selectedIds.indexOf(numberIndex) === - 1;

    startGame = () => {
        this.setState({ status: 'playing' }, () => {
            this.intervalId = setInterval(() => {
                this.setState(prevState => {
                    const newRemainingSeconds =
                        prevState.remainingSeconds - 1;
                    if (newRemainingSeconds === 0) {
                        clearInterval(this.intervalId);
                        return { status: 'lost', remainingSeconds: 0 };
                    }
                    return { remainingSeconds: newRemainingSeconds };
                });
            }, 1000);
        });
    };

    selectNumber = numberIndex => {
        this.setState(
            prevState => {
                if (prevState.status !== 'playing') {
                    return null;
                }
                const newSelectedIds =
                    [ ...prevState.selectedIds, numberIndex ];
                return {
                    selectedIds: newSelectedIds,
                    status: this.calcGameStatus(newSelectedIds),
                };
            },
            () => {
                if (this.state.status !== 'playing') {
                    clearInterval(this.intervalId);
                }
            }
        );
    };
    calcGameStatus = newSelectedIds => {
        const sumSelected = newSelectedIds.reduce(
            (acc, curr) => acc + this.buttonValues[curr],
            0
        );
        if (newSelectedIds.length !== this.numberOfButtons) {
            return 'playing';
        }

        if (sumSelected === this.result) {
            if (this.state.remainingSeconds > 10) {
                this.props.sendWinningGamePoints(2);
            } else {
                this.props.sendWinningGamePoints(1);
            }
            return 'won';
        } else {
            return 'lost';
        }
    };

    render() {
        const { status, remainingSeconds } = this.state;
        return (
            <div className="app">
                {status === 'playing' && <div className="timer">{remainingSeconds}</div>}
                <div className="result" style={{ backgroundColor: colors[status] }}>
                    {status === 'new' ? 'click on the start button' : this.result}
                </div>
                <div className="buttons">
                    {this.buttonValues.map((value, index) =>
                        <Number
                            key={index}
                            id={index}
                            value={status === 'new' ? '?' : value}
                            clickable={this.isNumberAvailable(index)}
                            onClick={this.selectNumber}
                        />
                    )}
                </div>
                <div>
                    {status === 'new' && <button className="gameButton" onClick={this.startGame}>Start</button>}

                    {['won', 'lost'].includes(status) && <button className="gameButton" onClick={this.props.onPlayAgain}>Play Again</button>}
                </div>
                    Click on {this.numberOfButtons} button so that the sum is {this.result} within {this.props.seconds} seconds.
            </div>
        );
  }
}

export default App;
