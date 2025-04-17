from flask import Flask, request, jsonify
from flask_cors import CORS
from moviepy.video.io.VideoFileClip import VideoFileClip
from PIL import Image
import numpy as np
import os

app = Flask(__name__, static_url_path='/static')
CORS(app)

# Directories
UPLOAD_FOLDER = 'uploads'
SNAPSHOT_FOLDER = os.path.join('static', 'snapshots')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(SNAPSHOT_FOLDER, exist_ok=True)

@app.route('/search_video', methods=['POST'])
def search_video():
    video_file = request.files.get('video')
    search_text = request.form.get('searchText')

    if not video_file or not search_text:
        return jsonify({"success": False, "message": "No video or search text provided."}), 400

    video_filename = video_file.filename
    video_path = os.path.join(UPLOAD_FOLDER, video_filename)
    video_file.save(video_path)

    try:
        video_clip = VideoFileClip(video_path)
    except Exception as e:
        return jsonify({"success": False, "message": f"Error processing video: {str(e)}"}), 500

    results = []

    for t in range(0, int(video_clip.duration), 10):  # Check every 10 seconds
        text = extract_text_from_video(video_clip, t)

        if search_text.lower() in text.lower():
            # Get frame at timestamp
            frame = video_clip.get_frame(t)
            img = Image.fromarray(frame)

            # Save snapshot
            snapshot_filename = f"{os.path.splitext(video_filename)[0]}_{t}.jpg"
            snapshot_path = os.path.join(SNAPSHOT_FOLDER, snapshot_filename)
            img.save(snapshot_path)

            # Append result with snapshot URL
            results.append({
                "time": t,
                "text": text,
                "snapshot_url": f"/static/snapshots/{snapshot_filename}"
            })

    # Cleanup uploaded video
    video_clip.close()
    os.remove(video_path)

    return jsonify({"success": True, "results": results})

def extract_text_from_video(video_clip, time):
    """
    Dummy simulation for text extraction.
    Replace this with actual OCR or Speech-to-Text in production.
    """
    return f"Sample text at {time} seconds."

if __name__ == '__main__':
    app.run(debug=True)
