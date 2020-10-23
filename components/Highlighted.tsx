interface PropInterface {
	content: string;
}

const Highlighted = (props: PropInterface) => {
	const { content } = props;

	return <span className='highlighted'>{content}</span>;
};

export default Highlighted;
