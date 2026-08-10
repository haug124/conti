# carousel-gateway — extracted source computed styles

## Homepage shape (main .product-area-gateway)
- Layout: horizontal tns strip, 5 tiles visible in ~1385px container (10/12 centered)
- Tile image ~170px wide x 215px tall; step ~215px => gap ~45px between tiles
- Center-active tile enlarged: image 221x280
- Title h5: 24px / 700 / rgb(0,0,0) / line-height 35px / letter-spacing 0.5px / margin 0 / text-align left
- Link "Explore": 18px / 700 / rgb(0,0,0) / no underline / letter-spacing 0.2px / display block
- content wrap padding: 0 15px
- background: grey wavy key-visual image behind tiles; block bg transparent
- pagination: dots (page-based, 2 dots)

## Car-landing shape (main .product-highlighting-cards)
- Layout: horizontal strip, 4 tiles visible in ~1140px; centered text
- Tile ~283px wide x 422px tall; image 190x190 square, object-fit fill (transparent PNG)
- Eyebrow span: 16px / 500 / rgb(255,165,0) ORANGE / letter-spacing 0.24px / line-height 19px / margin 0
- Title h5: 24px / 700 / rgb(0,0,0) / line-height 35px / letter-spacing 0.5px / margin 8px 0 4px
- Description p: 18px / 300 / rgb(0,0,0) / line-height 24px / margin 8px 0 0
- Link "View details": 18px / 500 / rgb(0,0,0) / no underline / letter-spacing 0.2px / display block
- info wrap padding: 0 0 54px; text-align start (visually centered via slider centering)
- nav: circular prev/next arrows (left/right)

## Decorated EDS DOM (localhost)
.carousel-gateway.block
  > .carousel-gateway-slides-container
    > ul.carousel-gateway-slides
      > li.carousel-gateway-slide
        > div.carousel-gateway-slide-image (picture)
        > div.carousel-gateway-slide-content (h5 + p[eyebrow/desc/cta])
  > nav > ol.carousel-gateway-slide-indicators (dots)

Homepage content cell: h5 + p>a(Explore)
Car-landing content cell: p(eyebrow) + h5 + p(desc) + p>a(View details)
Links NOT auto-decorated to .button (stay plain <p><a>).
