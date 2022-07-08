type Props = {
  category: string;
  name: string;
  date: string;
  id: number;
  content: string;
};
const Documents = ({ category, name, date, id, content }: Props) => {
  return (
    <>
      <div className="item">
        <div className="category">{category}</div>
        <div className="name">{name}</div>
        <div className="date">{date}</div>
        <div className="id">{id}</div>
        <div className="content">{content}</div>
      </div>
    </>
  );
};
export default Documents;
