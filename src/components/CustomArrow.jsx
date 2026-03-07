import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function CustomArrow({ onClick , direction}) {
  return (
    <button
      onClick={onClick}
      className={`frosted-glass-arrow ${direction}`}
    >
      {direction === "left" ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
    </button>
  );
}

export default CustomArrow;