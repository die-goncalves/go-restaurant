import NextImage from 'next/image'
import { shimmerBase64 } from '@/src/utils/blur-data-url'
import { css } from '@/styled-system/css'
import { Store } from '../page'
import { Breadcrumb } from './breadcrumb'
import { ChangeAddress } from './change-address'
import { Contact } from './contact'
import { Delivery } from './delivery'
import { Location } from './location'
import { Opening } from './opening'
import { PositionSync } from './position-sync'
import { StoreRating } from './store-rating'
import { StoreSections } from './store-sections'

type StoreContentProps = {
  store: Store
}
export function StoreContent({
  store: {
    address,
    average_rating,
    categories,
    coordinates,
    description,
    id,
    image_url,
    name,
    neighborhood,
    operating_hours,
    phone_number,
    products,
    total_reviews
  }
}: StoreContentProps) {
  return (
    <>
      <PositionSync />
      <div
        className={css({
          maxWidth: 'breakpoint-xlarge',
          marginInline: 'auto',
          minHeight: '100vh',
          background: 'surface'
        })}
      >
        <div
          className={css({
            paddingInline: { base: '4', medium: '6', expanded: '8' },
            marginBlockEnd: '3'
          })}
        >
          <Breadcrumb name={name} neighborhood={neighborhood} />
        </div>

        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
            gridTemplateRows: 'min-content minmax(0, 1fr)',
            expanded: {
              gridTemplateColumns: '2fr 1fr',
              gridTemplateRows: 'repeat(1, minmax(0, 1fr))',
              columnGap: '6',
              paddingInline: '8'
            }
          })}
        >
          <div
            className={css({
              paddingInline: { base: '4', medium: '6', expanded: 'unset' }
            })}
          >
            <div
              className={css({
                display: 'flex',
                marginBlockStart: { base: '3', expanded: 'unset' },
                alignItems: 'center',
                gap: '2'
              })}
            >
              <h1 className={css({ fontSize: '3xl', fontWeight: 'medium' })}>
                {name}
              </h1>
            </div>

            <div className={css({ marginBlockStart: '2' })}>
              <span>{description}</span>
            </div>

            <div
              className={css({
                display: 'flex',
                marginBlockStart: '2',
                alignItems: 'center',
                gap: '1'
              })}
            >
              <StoreRating
                averageRating={average_rating}
                totalReviews={total_reviews}
              />
            </div>

            <div
              className={css({
                display: 'flex',
                marginBlockStart: '2',
                flexWrap: 'wrap',
                gap: '2'
              })}
            >
              {categories.map(c => (
                <div key={c.id}>
                  <p
                    className={css({
                      background: 'tertiary.container',
                      color: 'tertiary.container.on',
                      textStyle: 'sm',
                      paddingInline: '2'
                    })}
                  >
                    {c.name}
                  </p>
                </div>
              ))}
            </div>

            <div className={css({ marginBlockStart: '2' })}>
              <ChangeAddress
                id={id}
                neighborhood={neighborhood}
                coord={coordinates}
              />
            </div>

            <div className={css({ marginBlockStart: '2' })}>
              <Delivery coordinates={coordinates} />
            </div>

            <div className={css({ marginBlockStart: '2' })}>
              <Opening operatingHours={operating_hours} />
            </div>

            <div
              className={css({
                display: 'flex',
                marginBlockStart: '2',
                alignItems: 'center',
                gap: '2'
              })}
            >
              <div className={css({ alignSelf: 'start' })}>
                <Location coord={coordinates} address={address} />
              </div>
              <p>{address}</p>
            </div>

            <div className={css({ marginBlockStart: '2' })}>
              <Contact phoneNumber={phone_number} />
            </div>
          </div>

          <div
            className={css({
              gridColumnStart: { base: 1, expanded: 2 },
              gridRowStart: 1
            })}
          >
            <div
              className={css({
                display: 'flex',
                position: 'relative',
                height: '44',
                expanded: { height: '100%' }
              })}
            >
              <NextImage
                src={image_url!}
                alt={name!}
                fill
                className={css({ objectFit: 'cover' })}
                placeholder="blur"
                blurDataURL={shimmerBase64}
                sizes="(max-width: 768px) 70vw, (min-width: 769px) 30vw"
              />
            </div>
          </div>
        </div>

        <StoreSections store={{ id, name, image_url }} products={products} />
      </div>
    </>
  )
}
