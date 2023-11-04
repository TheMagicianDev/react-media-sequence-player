import React, { PureComponent } from 'react'
import classNames from 'classnames'

import './styles.scss'

class ImageContainer extends PureComponent {
  render() {
    const {
      url,
      show
    } = this.props;

    return (
      <div 
        className={
            classNames(
                'ImageContainer',
                'SequencePlayerContainer',
                {
                  show
                }
            )
        }
    >
        <img src={url} alt=""/>
      </div>
    )
  }
}

export default ImageContainer;
