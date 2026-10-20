// A product video that costs nothing until the visitor presses play: preload="none"
// with a still as the poster. WebM first, MP4 as the fallback where we have one.
// Files live in public/videos/ (Northwind demo data only).
export default function Video({ name, title, width, height, mp4 = true, caption, phone = false }) {
  return (
    <figure className={phone ? "video phone" : "video"}>
      <div className="video-frame">
        <video
          controls
          preload="none"
          playsInline
          poster={`/videos/${name}-poster.webp`}
          width={width}
          height={height}
          aria-label={title}
        >
          <source src={`/videos/${name}.webm`} type="video/webm" />
          {mp4 && <source src={`/videos/${name}.mp4`} type="video/mp4" />}
          <a href={`/videos/${name}.${mp4 ? "mp4" : "webm"}`}>Download the video: {title}</a>
        </video>
      </div>
      {caption && <figcaption className="caption">{caption}</figcaption>}
    </figure>
  );
}
