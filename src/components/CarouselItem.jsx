function CarouselItem({ image, title, description, altText }) {
  return (
    <div className='carousel-item-style'>
        <img src={image} alt={altText} className='carousel-image-placeholder-style'/>
        <h3 className='carousel-title-style'>{title}</h3>
        <p className='carousel-description-style'>{description}</p>
    </div>
  );
}

export default CarouselItem;