# Stub logic: fake matches
def process_video(filepath, search_text):
    # Simulate matches if keyword contains "react"
    if "react" in search_text.lower():
        return [
            {'timestamp': 12, 'text': 'React Intro'},
            {'timestamp': 45, 'text': 'React Components'},
            {'timestamp': 78, 'text': 'Props and State'}
        ]
    return []
