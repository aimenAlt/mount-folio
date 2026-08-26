import './Footer.scss';

export default function Footer({ data }) {
  return (
    <footer>
      <span>{data.left}</span>
      <span>{data.right}</span>
    </footer>
  );
}
