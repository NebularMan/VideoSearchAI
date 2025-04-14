from flask import Flask, request, jsonify
from flask_cors import CORS
from moviepy.video.io.VideoFileClip import VideoFileClip

import os

app = Flask(__name__)
CORS(app)

# Create upload folder if it doesn't exist
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/search_video', methods=['POST'])
def search_video():
    # Get the video file and search text from the form data
    video_file = request.files.get('video')
    search_text = request.form.get('searchText')

    if not video_file or not search_text:
        return jsonify({"success": False, "message": "No video or search text provided."}), 400

    # Save the video file temporarily
    video_path = os.path.join(UPLOAD_FOLDER, video_file.filename)
    video_file.save(video_path)

    # Process the video for text extraction (dummy example)
    try:
        video_clip = VideoFileClip(video_path)
    except Exception as e:
        return jsonify({"success": False, "message": f"Error processing video: {str(e)}"}), 500

    # Simulate extracting subtitles/timestamps (Dummy example: every 10 seconds)
    results = []
    for t in range(0, int(video_clip.duration), 10):  # Every 10 seconds
        text = extract_text_from_video(video_clip, t)
        if search_text.lower() in text.lower():
            results.append({"time": t, "text": text})

    # Cleanup the uploaded video file
    os.remove(video_path)

    return jsonify({"success": True, "results": results})

def extract_text_from_video(video_clip, time):
    """
    Dummy function to simulate text extraction from video at a given timestamp.
    You can replace this with an actual Optical Character Recognition (OCR) or
    Speech-to-Text (STT) function to extract meaningful text from the video.
    """
    # Here we simulate the text based on the timestamp
    return f"Sample text at {time} seconds."

if __name__ == '__main__':
    app.run(debug=True)

