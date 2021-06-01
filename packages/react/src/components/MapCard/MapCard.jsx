import React, { useMemo, useState } from 'react';
import classnames from 'classnames';
import { Maximize16, Close16 } from '@carbon/icons-react';
import { useLangDirection } from 'use-lang-direction';

import { Button } from '../../index';
import Card from '../Card/Card';
import { getResizeHandles, getUpdatedCardSize } from '../../utils/cardUtilityFunctions';
import { CARD_ACTIONS, CARD_SIZES } from '../../constants/LayoutConstants';
import { CardPropTypes, MapCardPropTypes } from '../../constants/CardPropTypes';
import { settings } from '../../constants/Settings';

import Legend from './Legend';
import ZoomControl from './ZoomControl';
import MapControls from './MapControls';

const { iotPrefix } = settings;

const propTypes = {
  ...CardPropTypes,
  ...MapCardPropTypes,
};

const defaultProps = {
  isLegendFullWidth: false,
  isSettingPanelOpen: false,
  i18n: {
    cardTitle: 'Card Title',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom out',
    configurationTitle: 'Map configuration',
    closeSettingsIconText: 'Close',
    expandLabel: 'Expand',
    layerTriggerIconDescription: 'Layered controls',
    legendTitle: 'Legend',
    hideLegend: 'Hide legend',
    showLegend: 'Show legend',
    scrollUp: 'Scroll up',
    scrollDown: 'Scroll down',
  },
  layeredControls: [],
  mapControls: [],
  size: CARD_SIZES.LARGEWIDE,
  stops: [],
  testId: 'map-card',
};

const MapCard = ({
  children,
  mapContainerRef,
  availableActions,
  size,
  mapControls,
  isResizable,
  isExpanded,
  i18n,
  id,
  isLegendFullWidth,
  onZoomIn,
  onZoomOut,
  stops,
  options,
  layeredControls,
  onCardAction,
  isSettingPanelOpen,
  settingsContent: SettingsContent,
  testId,
  ...others
}) => {
  const mergedI18n = useMemo(() => ({ ...defaultProps.i18n, ...i18n }), [i18n]);
  const langDir = useLangDirection();
  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);
  const BASE_CLASS_NAME = `${iotPrefix}--map`;
  const resizeHandles = useMemo(() => (isResizable ? getResizeHandles(children) : []), [
    children,
    isResizable,
  ]);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);

  const tooltipPosition = React.useMemo(() => (langDir === 'ltr' ? 'left' : 'right'), [langDir]);
  const controls =
    mapControls.length || layeredControls.length ? (
      <MapControls
        testId={`${testId}-map-controls`}
        controls={mapControls}
        layeredControls={layeredControls}
        tooltipPosition={tooltipPosition}
        i18n={mergedI18n}
        isExpandedMode={isExpanded}
      />
    ) : null;

  const myAvailableActions = {
    ...availableActions,
    settings: isExpanded && availableActions?.settings,
  };

  return (
    <Card
      title={mergedI18n.cardTitle}
      size={newSize}
      availableActions={myAvailableActions}
      isResizable={isResizable}
      isExpanded={isExpanded}
      resizeHandles={resizeHandles}
      i18n={mergedI18n}
      id={id}
      renderExpandIcon={Maximize16}
      onCardAction={onCardAction}
      contentClassName={`${BASE_CLASS_NAME}-card-content`}
      className={`${BASE_CLASS_NAME}`}
      testID={testId}
      {...others}
    >
      <>
        <div
          ref={mapContainerRef}
          className={classnames(`${BASE_CLASS_NAME}-container`, {
            [`${BASE_CLASS_NAME}-container__open`]: isSettingPanelOpen,
          })}
        >
          <div
            className={classnames(`${BASE_CLASS_NAME}-controls`, {
              [`${BASE_CLASS_NAME}-controls__has-fullwidth-legend`]:
                isLegendFullWidth && !isLegendCollapsed,
              [`${BASE_CLASS_NAME}-controls__has-increased-margins`]: isExpanded,
            })}
          >
            {controls}
            <ZoomControl
              testId={`${testId}-zoom-control`}
              i18n={{ zoomIn: mergedI18n.zoomIn, zoomOut: mergedI18n.zoomOut }}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              tooltipPosition={tooltipPosition}
              smallButtons={!isExpanded}
            />
          </div>
          <Legend
            testId={`${testId}-legend`}
            hideLegendText={mergedI18n.hideLegend}
            showLegendText={mergedI18n.showLegend}
            titleText={mergedI18n.legendTitle}
            stops={stops}
            isFullWidth={isLegendFullWidth}
            isCollapsed={isLegendCollapsed}
            increasedMargin={isExpanded}
            onCollapsToggle={() => {
              setIsLegendCollapsed(!isLegendCollapsed);
            }}
          />
        </div>
        <div
          className={classnames(`${BASE_CLASS_NAME}-settings`, {
            [`${BASE_CLASS_NAME}-settings__open`]: isSettingPanelOpen,
          })}
        >
          <div className={`${BASE_CLASS_NAME}-settings-header`}>
            <h3 className={`${BASE_CLASS_NAME}-settings-header-title`}>
              {mergedI18n.configurationTitle}
            </h3>
            <Button
              className={`${BASE_CLASS_NAME}-settings-close-btn`}
              kind="ghost"
              size="small"
              hasIconOnly
              renderIcon={Close16}
              iconDescription={mergedI18n.closeSettingsIconText}
              onClick={() => {
                onCardAction(id, CARD_ACTIONS.ON_SETTINGS_CLICK);
              }}
            />
          </div>
          <SettingsContent />
        </div>
      </>
    </Card>
  );
};

MapCard.propTypes = propTypes;
MapCard.defaultProps = defaultProps;
export default MapCard;
