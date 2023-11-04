# react-media-sequence-player

A well designed Media sequence player. That can play sequences of different videos, animated text messages and images. Very useful in a promotion screen space. Like in waiting queue system screens which contain a promotion space.

This package have a brother package that does allow the creation of the sequences. The link will be added later once published.

> As is. This is a direct dump from a very old project. Slightly refactored.

## Props

### mediaBaseUrl

- Set the media base url. Root url for where to get the media.

## API

You can get a ref to the API using a `React.createRef()` reference

```jsx
class SomeParent {
  mediaPlayerRef = React.createRef();

  render() {
    return (
      <div>
        <MediaSequencePlayer ref={ this.mediaPlayerRef } />
      </div>
    );
  }
}
```

### mediaPlayerRef.setSequence()

Setting the sequence to play. It start playing immediately. If you want to not start playing. Use `.pause()` right away after it.

#### Sequence

An array of medias,

A media object have the following interface

```ts
interface IMedia {
  id: string
  text?: string
  isText?: boolean,
  mimeType: string,
  mediaSequence: {
    duration: number,
    textBackground?: string,
    textColor?: string 
  }
}
```

### mediaPlayerRef.pause()

Pause playing.

### mediaPlayerRef.resume()

Resume playing from exactly where it was paused.Including from start.
