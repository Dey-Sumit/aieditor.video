{
  "buildCommand": "node deploy.mjs && next build"
}

// ----------------

TODOs:

Fix:  
  - Preset adding is hardcoded now
  - Inner items of preset's startFrame is hardcoded



----
// ONE CLIP : NO SPLIT
ACTION 1  :
[
    {
        "id": "clip-1",
        "start": 1,
        "duration": 660,
        "src": "https://videos.pexels.com/video-files/3069112/3069112-hd_1920_1080_30fps.mp4",
      
    }
]

ACTION 2  :

// ----------- with split -----
{
    "clips": [
        {
            "id": "clip-1",
            "start": 1,
            "duration": 94,
            "src": "https://videos.pexels.com/video-files/3069112/3069112-hd_1920_1080_30fps.mp4",
          
        },
        {
            "id": "clip-1728821070876",
            "start": 95,
            "duration": 566,
            "src": "https://videos.pexels.com/video-files/3069112/3069112-hd_1920_1080_30fps.mp4",
            "videoStartTime": 94
        }
    ]
}

ACTION 3  :

// with split on 2nd ----
{
    "clips": [
        {
            "id": "clip-1",
            "start": 1,
            "duration": 94,
            "src": "https://videos.pexels.com/video-files/3069112/3069112-hd_1920_1080_30fps.mp4",
           
        },
        {
            "id": "clip-1728821070876",
            "start": 95,
            "duration": 252,
            "src": "https://videos.pexels.com/video-files/3069112/3069112-hd_1920_1080_30fps.mp4",
           
            "videoStartTime": 94
        },
        {
            "id": "clip-1728821264540",
            "start": 347,
            "duration": 314,
            "src": "https://videos.pexels.com/video-files/3069112/3069112-hd_1920_1080_30fps.mp4",
           
            "videoStartTime": 346
        }
    ]
}

ACTION 4  :

// split on the 1st item:
{
    "clips": [
        {
            "id": "clip-1",
            "start": 1,
            "duration": 27,
            "src": "https://videos.pexels.com/video-files/3069112/3069112-hd_1920_1080_30fps.mp4",
        },
        {
            "id": "clip-1728821529943",
            "start": 28,
            "duration": 67,
            "src": "https://videos.pexels.com/video-files/3069112/3069112-hd_1920_1080_30fps.mp4",
    
        },
        {
            "id": "clip-1728821070876",
            "start": 95,
            "duration": 252,
            "src": "https://videos.pexels.com/video-files/3069112/3069112-hd_1920_1080_30fps.mp4",         
            
        },
        {
            "id": "clip-1728821264540",
            "start": 347,
            "duration": 314,
            "src": "https://videos.pexels.com/video-files/3069112/3069112-hd_1920_1080_30fps.mp4",   
        }
    ]
}

// 1 . on add get the video duration, and get the total frames by multiplying with 30(fps)
// 2. on resize from end:
    - add the delta to the video's videoEndsAtInFrames
// 3. on resize from start:
    - add the delta to the video's videoStartsAtInFrames