import React from 'react';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import { Image32 } from '@carbon/icons-react';
import { spacing05 } from '@carbon/layout';

import {
  ImageCardPropTypes,
  CardPropTypes,
} from '../../constants/CardPropTypes';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import {
  getResizeHandles,
  getUpdatedCardSize,
} from '../../utils/cardUtilityFunctions';

import ImageHotspots from './ImageHotspots';

const ContentWrapper = styled.div`
  height: 100%;
  max-height: 100%;
  padding: 0 ${spacing05} ${spacing05};
`;

const EmptyDiv = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const propTypes = { ...CardPropTypes, ...ImageCardPropTypes };

const defaultProps = {
  i18n: {
    loadingDataLabel: 'Loading hotspot data',
  },
  locale: 'en',
};

const ImageCard = ({
  title,
  content,
  children,
  values,
  size,
  onCardAction,
  availableActions,
  isEditable,
  isExpanded,
  isResizable,
  error,
  isLoading,
  i18n: { loadingDataLabel, ...otherLabels },
  renderIconByName,
  locale,
  ...others
}) => {
  const { src } = content;
  const hotspots = values ? values.hotspots || [] : [];

  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);

  const supportedSizes = [
    CARD_SIZES.MEDIUMTHIN,
    CARD_SIZES.MEDIUM,
    CARD_SIZES.MEDIUMWIDE,
    CARD_SIZES.LARGE,
    CARD_SIZES.LARGEWIDE,
  ];
  const supportedSize = supportedSizes.includes(newSize);
  const mergedAvailableActions = { expand: supportedSize, ...availableActions };

  const isCardLoading = isNil(src) && !isEditable && !error;
  const resizeHandles = isResizable ? getResizeHandles(children) : [];

  return (
    <Card
      title={title}
      size={newSize}
      onCardAction={onCardAction}
      availableActions={mergedAvailableActions}
      isLoading={isCardLoading} // only show the spinner if we don't have an image
      isExpanded={isExpanded}
      isEditable={isEditable}
      resizeHandles={resizeHandles}
      {...others}
      error={error}
      i18n={otherLabels}>
      {!isCardLoading
        ? (
            // Get width and height from parent card
            { width, height } // eslint-disable-line react/prop-types
          ) => (
            <ContentWrapper>
              {supportedSize ? (
                isEditable ? (
                  <EmptyDiv>
                    <Image32 width={250} height={250} fill="gray" />
                  </EmptyDiv>
                ) : content && src ? (
                  <ImageHotspots
                    {...content}
                    width={width - 16 * 2} // Need to adjust for card chrome
                    height={height - (48 + 16)} // Need to adjust for card chrome
                    isExpanded={isExpanded}
                    hotspots={hotspots}
                    isHotspotDataLoading={isLoading}
                    loadingHotspotsLabel={loadingDataLabel}
                    renderIconByName={renderIconByName}
                    locale={locale}
                  />
                ) : (
                  <p>Error retrieving image.</p>
                )
              ) : (
                <p>Size not supported.</p>
              )}
            </ContentWrapper>
          )
        : null}
    </Card>
  );
};

ImageCard.propTypes = propTypes;

ImageCard.defaultProps = defaultProps;

export default ImageCard;
