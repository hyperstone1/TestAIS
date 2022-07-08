type Props = {
  imageUrl: string;
  title: string;
  date: string;
  description: string;
};
export default function News({ imageUrl, title, date, description }: Props) {
  return (
    <div className="news">
      <img src={imageUrl} />
      <div className="title">{title}</div>
      <div className="date">{date}</div>
      <span className="description">{description}</span>
    </div>
  );
}
