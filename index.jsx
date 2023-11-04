import React, { PureComponent } from "react";

import VideoContainer from "./VideoContainer";
import ImageContainer from "./ImageContainer";
import TextContainer from "./TextContainer";

import "./styles.scss";

export default class SequencePlayer extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			sequence: [],
			currentIndex: 0,
			play: true,
			volume: 1,
			mute: false,
			startTime: null,
			pauseTime: null,
			precedentMedia: null, // when null it doesn't render (otherwise it does, and with show: false ==> which make it disapear)
			currentShow: true // used to animate (at new current assignement (currentShow = false))
			// showTest: false
		};

		this.mediaBaseUrl = props.mediaBaseUrl

		this.mediaPlayEndTimeoutHandler = null;

		this.onVideoEnded = this.onVideoEnded.bind(this);
		// this.onVideoPause = this.onVideoPause.bind(this);
		this.onVideoError = this.onVideoError.bind(this);

		this.handleEvents();

		// setTimeout(() => {
		//   this.setState({
		//     ...this.state,
		//     showTest: true
		//   })
		// }, 5000);
	}

	setSequence(displayMediaSequence) {
		this.setState(
			{
				...this.state,
				sequence: displayMediaSequence || [],
				currentIndex: 0,
				current: {
					startTime: new Date(),
					elapsed: 0,
					duration:
						displayMediaSequence[0].mediaSequence.duration,
					resumeTime: null,
					pauseTime: null
				}
			},
			() => {
				this.startPlayingTimer();
			}
		);
	}

	pause() {
		const {
			current: { startTime, resumeTime, elapsed }
		} = this.state;

		let _resumeTime = resumeTime || startTime;

		if (this.mediaPlayEndTimeoutHandler) {
			clearTimeout(this.mediaPlayEndTimeoutHandler);
		}

		const pauseTime = new Date();

		this.setState({
			...this.state,
			play: false,
			current: {
				...this.state.current,
				pauseTime,
				elapsed:
					elapsed + (_resumeTime.getTime() - pauseTime.getTime())
			}
		});
	}

	resume() {
		const {
			sequence,
			currentIndex,
			current: { duration, startTime }
		} = this.state;

		const current = sequence[currentIndex];
		let resumeTime;

		if (current.isText || current.mimeType.includes("image")) {
			resumeTime = new Date();

			let timeout =
				duration * 1000 +
				startTime.getTime() -
				resumeTime.getTime();

			if (timeout < 0) timeout = 0;

			this.mediaPlayEndTimeoutHandler = setTimeout(() => {
				this.current_onEnded();
				this.mediaPlayEndTimeoutHandler = null;
			}, timeout);
		}

		this.setState({
			...this.state,
			play: true,
			current: {
				...this.state.current,
				resumeTime
			}
		});
	}

	onVideoEnded() {
		this.current_onEnded();
	}

	onVideoError() {
		this.current_onEnded();
	}

	current_onEnded() {
		const { sequence, currentIndex } = this.state;

		const sequenceSize = sequence.length;
		const nextIndex = (currentIndex + 1) % sequenceSize;

		this.setState(
			{
				// start the next sequence
				...this.state,
				currentIndex: nextIndex,
				current: {
					elapsed: 0,
					startTime: new Date(),
					resumeTime: null,
					pauseTime: null,
					duration: sequence[nextIndex].mediaSequence.duration
				}
			},
			() => {
				if (this.state.play) {
					this.startPlayingTimer();
				}
			}
		);
	}

	renderMedias() {
		const sequenceSize = this.state.sequence.length;
		if (sequenceSize > 0 && this.state.currentIndex < sequenceSize) {
			const current = this.state.sequence[this.state.currentIndex];
			const next = this.state.sequence[
				(this.state.currentIndex + 1) % sequenceSize
			];

			if (sequenceSize === 1) {
				return this.renderOneMedia(current, this.state.currentShow);
			} else {
				return [
					this.renderOneMedia(current, this.state.currentShow),
					this.renderOneMedia(
						next,
						false,
						true
					)
				]; // showing current and not next
			}
		} else {
			return null;
		}
	}

	renderOneMedia(media, show, dontPlay) {
		if (media.isText) {
			return (
				<TextContainer
					show={show}
					key={media.id}
					text={media.text}
					backgroundStyle={{
						background: media.mediaSequence.textBackground
					}}
					backgroundInner={null}
					textStyle={{
						color: media.mediaSequence.textColor || "white"
					}}
				/>
			);
		} else {
			if (media.mimeType.includes("video")) {
				return (
					<VideoContainer
						show={show}
						key={media.id}
						url={this.mediaBaseUrl + media.id}
						// onPause={this.onVideoPause}
						onEnded={this.onVideoEnded}
						onError={this.onVideoError}
						playing={!dontPlay && this.state.play}
					/>
				);
			} else if (media.mimeType.includes("image")) {
				return (
					<ImageContainer
						show={show}
						key={media.id}
						url={this.mediaBaseUrl + media.id}
					/>
				);
			}
		}
	}

	startPlayingTimer() {
		// start playing timer
		const current = this.state.sequence[this.state.currentIndex];

		if (this.mediaPlayEndTimeoutHandler)
			clearTimeout(this.mediaPlayEndTimeoutHandler); // clear first if the old timer exist

		if (current) {
			if (current.isText || current.mimeType.includes("image")) {
				this.mediaPlayEndTimeoutHandler = setTimeout(() => {
					this.mediaPlayEndTimeoutHandler = null;
					this.current_onEnded();
				}, this.state.current.duration * 1000);
			}
		}
	}

	render() {
		return (
			<div className="SequencePlayer">
				{ this.renderMedias() }
			</div>
		);
	}
}

/**
 *
 * implement the handling of pause resume from an admin control (easy starting timer, and resume!)
 */
