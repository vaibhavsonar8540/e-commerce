import Image from 'next/image'

const CustomImage = ({srcAttr, altAttr, className , titleAttr , width , height}) => {
  return (
    <div>
        <Image 
            src={srcAttr}
            alt={altAttr}
            title={titleAttr}
            className={className}
            width={width}
            height={height}
        />
    </div>
  )
}

export default CustomImage