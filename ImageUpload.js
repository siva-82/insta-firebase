import { Button, Input } from '@material-ui/core';
import React, { useState } from 'react';
import { db, storage } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';

const ImageUpload = ({ username }) => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState('');
  //const [url, setUrl] = useState('');

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = (e) => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection('posts').add({
              imageUrl: url,
              caption: caption,
              userName: username,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });

            setProgress(0);
            setCaption('');
            setImage(null);
          });
      }
    );
  };
  return (
    <div className="imageupload">
      <progress
        className="imageupload__progress"
        value={progress}
        max="100"
      ></progress>

      <Input
        type="text"
        value={caption}
        placeholder="enter a caption"
        onChange={(e) => setCaption(e.target.value)}
      />

      <input type="file" onChange={handleChange} />

      <Button
        disabled={!caption || !image}
        className="imageupload__button"
        onClick={handleUpload}
      >
        Upload
      </Button>
    </div>
  );
};

export default ImageUpload;
