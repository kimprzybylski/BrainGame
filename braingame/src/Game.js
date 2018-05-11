import React, { Component } from 'react';
import './App.css';
import App from './App';

class Game extends Component {
    state = {
        gameId: 0,
        gamesWon: 0
    };

    getWinningGame = p => {
        this.setState(prevState => ({
            gamesWon: prevState.gamesWon + p
        }));
    };

    resetGame = () =>
        this.setState(prevState => ({
            gameId: prevState.gameId + 1,
        }));

    render() {
        return (
            <div className="app">
                Points: {this.state.gamesWon} Total games: {this.state.gameId}
            <App
                key={this.state.gameId}
                autoPlay={this.state.gameId > 1}
                seconds={20}
                onPlayAgain={this.resetGame}
                sendWinningGamePoints={this.getWinningGame}
            />
            </div>
        );
    }
}

export default Game