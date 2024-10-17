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
----
Split of a video:

- liteItems:[]

- sequenceItem:{}
// ----
1. get the splitFrame in the entire timeline: TL_SPLIT
2. get the splitFrame in the sequenceItem: // LI_SPLIT = TL_SPLIT - liteItem.startFrame 
3. originalItemDuration = liteItem.duration : LI_DURATION

4. update the item : // ORIGINAL_LI
    - startFrame : NO_CHANGE
    - duration = LI_SPLIT

5. create a copy of the liteItem // NEW_LI
    - startFrame = LI_SPLIT 
    - duration = LI_DURATION - LI_SPLIT
    - OFFSET = 0

--- sequenceItems{}
6.get the originalSequenceItem : sequenceItems.[ORIGINAL_LI.id] (no change needed if it's not a video/audio type)
7. create a copy from the originalSequenceItem : // NEW_SI
    - id = NEW_LI.id

=====
in case of video/audio:
startsAt:
endsAt:
-----------
tempEndsAt = originalSequenceItem.editableProps.endAt
originalSequenceItem:
    - startsAt: NO_CHANGE
    - endAt: LI_SPLIT
copiedSequenceItem:
    - startsAt: LI_SPLIT
    - endAt: tempEndsAt




---------

const NestedSequenceCompositionWithHardcoded = () => {
  return (
    <AbsoluteFill className="font-serif">
      <TransitionSeries name={"Layer F"}>
        <TransitionSeries.Sequence
          name={"Sequence 3"}
          durationInFrames={270}
          offset={90}
        >
          {/* -------------------------------- Preset Bg starts -------------------------------- */}
          <TransitionSeries name="Preset Bg">
            <TransitionSeries.Sequence
              name={"Sequence 4"}
              durationInFrames={270}
              offset={0}
              style={{
                background: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <div></div>
            </TransitionSeries.Sequence>
          </TransitionSeries>
          {/* -------------------------------- Preset Bg ends -------------------------------- */}

          {/* -------------------------------- Preset Fg starts -------------------------------- */}
          <TransitionSeries name="Preset Fg">
            <TransitionSeries.Sequence
              name={"Sequence 4"}
              durationInFrames={90}
              offset={0}
              className=""
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                }}
                className="grid place-items-center p-10 text-5xl text-white"
              >
                Like.
              </div>
            </TransitionSeries.Sequence>
            <TransitionSeries.Sequence
              name={"Sequence 5"}
              durationInFrames={90}
              offset={0}
              className=""
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                }}
                className="grid place-items-center p-10 text-5xl text-white"
              >
                Share.
              </div>
            </TransitionSeries.Sequence>
            <TransitionSeries.Sequence
              name={"Sequence 5"}
              durationInFrames={90}
              offset={0}
              className=""
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                }}
                className="grid place-items-center p-10 text-5xl text-white"
              >
                Subscribe.
              </div>
            </TransitionSeries.Sequence>
          </TransitionSeries>
          {/* -------------------------------- Preset Fg ends -------------------------------- */}
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
-------