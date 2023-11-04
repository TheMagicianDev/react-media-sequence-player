import React, { PureComponent } from 'react'
import ReactPlayer from 'react-player';
import classNames from 'classnames'

import './styles.scss'

class VideoContainer extends PureComponent {
    constructor(props) {
      super(props)
    
        this.onPause = this.onPause.bind(this);
        this.onEnded = this.onEnded.bind(this);
        this.onError = this.onError.bind(this);
        this.playerRef = this.playerRef.bind(this);
    }
    
    componentDidMount() {
        const { getPlayerRef } = this.props;
        if(typeof getPlayerRef === 'function') {
            getPlayerRef(this.playerRef);
        }
    }

    onPause(d) {
        const { onPause } = this.props;

        if(typeof onPause === "function") {
            onPause(d);
        }
    }

    onEnded(d) {
        const { onEnded } = this.props;

        if(typeof onEnded === "function") {
            onEnded(d);
        }
    }

    onError(d) {
        const { onError } = this.props;

        if(typeof onError === "function") {
            onError(d);
        }
    }

    playerRef() {
        return this.playerRef;
    }

  render() {
    const {
        url,
        playing,
        initTimeline,
        volume,
        mute,
        show
      } = this.props;
  
    return (
      <div 
        className={
            classNames(
                'VideoContainer',
                'SequencePlayerContainer',
                {
                  show
                }
            )
        }
    >
        <ReactPlayer
            className='player'
            ref={ref => {this.player = ref}}
            url={url}
            playing={playing}
            width='100%'
            height='100%'
            mute={mute}
            volume={volume || 1}
            onPause={this.onPause}
            onEnded={this.onEnded}
            onError={this.onError}
        />
      </div>
    )
  }
}

export default VideoContainer;
