import Carousel from "react-multi-carousel";
import CarouselItem from '../components/CarouselItem.jsx';
import CustomArrow from '../components/CustomArrow.jsx';

function Carousels({ gameDetails }) {
    const responsive = {
        largeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 4
        },
        desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        },
        tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        },
        mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        },
    };
    return (
        <Carousel className="carousel-games-carousel-wrapper"
            responsive={responsive}
            infinite = {true}
            showDots = {true}
            customRightArrow={<CustomArrow onClick={() => {}} direction="right" />}
            customLeftArrow={<CustomArrow onClick={() => {}} direction="left" />}
            autoPlay={true}
            autoPlaySpeed={5000}
            containerClass="carousel-container"
            centerMode={true}
            renderDotsOutside = {true}
        >
            {gameDetails.map(game => (
                <CarouselItem
                key={game.id}
                image={game.image}
                title={game.title}
                description={game.description}
                altText={game.altText}
                />
            ))}
        </Carousel>
  );
}

export default Carousels;