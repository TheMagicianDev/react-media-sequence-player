import React, { PureComponent } from "react";
import Typist from "react-typist";
import ReactRevealText from "react-reveal-text";
import classNames from "classnames";

import "./styles.scss";

const TYPIST_STYLE = 0,
	TEXT_REVEAL_STYLE = 1;

class TextContainer extends PureComponent {
	constructor(props) {
		super(props);

		this.gen = [
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1,
			0,
			1
		];

		this.state = {
			textRevealShow: false
		};

		setTimeout(() => {
			this.setState({
				...this.state,
				textRevealShow: true
			});
		}, 500);
	}

	renderText() {
		const { text, show } = this.props;
		const renderingStyle = this.gen[
			Math.floor(Math.random() * (this.gen.length - 1))
		];

		switch (renderingStyle) {
			case TYPIST_STYLE:
				return <Typist startDelay={1000}>{text}</Typist>;
			case TEXT_REVEAL_STYLE:
				return (
					<ReactRevealText
						show={show === true && this.state.textRevealShow}
					>
						{text}
					</ReactRevealText>
				);
			default:
				return null;
		}
	}

	render() {
		const {
			show,
			text,
			play,
			backgroundStyle,
			backgroundInner,
			textStyle
		} = this.props;

		return (
			<div
				className={classNames(
					"TextContainer",
					"SequencePlayerContainer",
					{
						show
					}
				)}
			>
				<pre
					className="text"
					style={{
						color: 'white',
						...textStyle
					}}
				>
					{this.renderText()}
				</pre>

				<div
					className="background"
					style={{
						...backgroundStyle
					}}
				>
					{backgroundInner}
				</div>
			</div>
		);
	}
}

export default TextContainer;
