import React, { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  TrashCan16,
  DocumentImport16,
  DocumentExport16,
  Maximize16,
  Tablet16,
  Laptop16,
  Screen16,
} from '@carbon/icons-react';
import {
  FileUploaderButton,
  TooltipIcon,
  ContentSwitcher,
  TextInput,
} from 'carbon-components-react';
import isEmpty from 'lodash/isEmpty';

import { settings } from '../../../constants/Settings';
import { Button, PageTitleBar } from '../../../index';
import IconSwitch from '../../IconSwitch/IconSwitch';

const { iotPrefix } = settings;

const propTypes = {
  /** Dashboard title */
  title: PropTypes.node,
  /** initial dashboard data to edit */
  breadcrumbs: PropTypes.arrayOf(PropTypes.node),
  /** if provided, renders edit button next to title linked to this callback */
  onEditTitle: PropTypes.func,
  /** if provided, renders import button linked to this callback
   * onImport(data, setNotification?)
   */
  onImport: PropTypes.func,
  /** if provided, renders export button linked to this callback
   * onExport(dashboardJson)
   */
  onExport: PropTypes.func,
  /** if provided, renders delete button linked to this callback */
  onDelete: PropTypes.func,
  /** If provided, renders cancel button linked to this callback */
  onCancel: PropTypes.func,
  /** If provided, renders back button linked to this callback */
  onBack: PropTypes.func,
  /** If provided, renders submit button linked to this callback
   * onSubmit(dashboardData)
   */
  onSubmit: PropTypes.func,
  /** Whether to disable the submit button */
  isSubmitDisabled: PropTypes.bool,
  /** Whether to set the loading spinner on the submit button */
  isSubmitLoading: PropTypes.bool,
  /** internationalization strings */
  i18n: PropTypes.shape({
    headerEditTitleButton: PropTypes.string,
    headerImportButton: PropTypes.string,
    headerExportButton: PropTypes.string,
    headerDeleteButton: PropTypes.string,
    headerCancelButton: PropTypes.string,
    headerBackButton: PropTypes.string,
    headerSubmitButton: PropTypes.string,
    headerFitToScreenButton: PropTypes.string,
    headerXlargeButton: PropTypes.string,
    headerLargeButton: PropTypes.string,
    headerMediumButton: PropTypes.string,
    dashboardTitleLabel: PropTypes.string,
    requiredMessage: PropTypes.string,
    saveTitleButton: PropTypes.string,
  }),
  /** The current dashboard's JSON */
  dashboardJson: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  /** currently selected breakpoint which is being held in state by DashboardEditor */
  selectedBreakpointIndex: PropTypes.number,
  /** handler to change the selectedBreakpoint state */
  setSelectedBreakpointIndex: PropTypes.func,
  /** if enabled, renders a ContentSwitcher with IconSwitches that allow for manually changing the breakpoint,
   * regardless of the screen width
   */
  breakpointSwitcher: PropTypes.shape({
    enabled: PropTypes.bool,
    allowedBreakpoints: PropTypes.arrayOf(PropTypes.string),
  }),
};

const defaultProps = {
  title: null,
  breadcrumbs: [],
  onEditTitle: null,
  onImport: null,
  onExport: null,
  onDelete: null,
  onCancel: null,
  onBack: null,
  onSubmit: null,
  isSubmitDisabled: false,
  isSubmitLoading: false,
  i18n: {
    headerEditTitleButton: 'Edit title',
    headerImportButton: 'Import',
    headerExportButton: 'Export',
    headerDeleteButton: 'Delete',
    headerCancelButton: 'Cancel',
    headerBackButton: 'Back',
    headerSubmitButton: 'Save and close',
    headerFitToScreenButton: 'Fit to screen',
    headerLargeButton: 'Large view',
    headerMediumButton: 'Medium view',
    headerSmallButton: 'Small view',
    dashboardTitleLabel: 'Dashboard title',
    requiredMessage: 'Required',
    saveTitleButton: 'Save title',
  },
  selectedBreakpointIndex: null,
  setSelectedBreakpointIndex: null,
  breakpointSwitcher: null,
};

const DashboardEditorHeader = ({
  title,
  breadcrumbs,
  onEditTitle,
  onImport,
  onExport,
  onDelete,
  onCancel,
  onBack,
  onSubmit,
  isSubmitDisabled,
  isSubmitLoading,
  i18n,
  dashboardJson,
  selectedBreakpointIndex,
  setSelectedBreakpointIndex,
  breakpointSwitcher,
}) => {
  const [isTitleEditMode, setIsTitleEditMode] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const mergedI18n = useMemo(() => ({ ...defaultProps.i18n, ...i18n }), [i18n]);
  const baseClassName = `${iotPrefix}--dashboard-editor-header`;
  const extraContent = (
    <div className={`${baseClassName}--right`}>
      <div className={`${baseClassName}--top`} />
      <div className={`${baseClassName}--bottom`}>
        {breakpointSwitcher?.enabled && (
          <ContentSwitcher
            onChange={(e) => setSelectedBreakpointIndex(e.index)}
            selectedIndex={selectedBreakpointIndex}
            className={`${baseClassName}--bottom__switcher`}
          >
            <IconSwitch
              name="fit-to-screen"
              text={mergedI18n.headerFitToScreenButton}
              renderIcon={Maximize16}
              index={0}
            />
            <IconSwitch
              name="large"
              text={mergedI18n.headerLargeButton}
              renderIcon={Screen16}
              index={1}
            />
            <IconSwitch
              name="medium"
              text={mergedI18n.headerMediumButton}
              renderIcon={Laptop16}
              index={2}
            />
            <IconSwitch
              name="small"
              text={mergedI18n.headerSmallButton}
              renderIcon={Tablet16}
              index={3}
            />
          </ContentSwitcher>
        )}

        {
          // FileUploaderButton isn't a true button so extra styling is needed to make it look like a iconOnly button
          onImport && (
            <TooltipIcon
              align="center"
              direction="bottom"
              tooltipText={mergedI18n.headerImportButton}
              className={`${baseClassName}--bottom__import`}
            >
              <FileUploaderButton
                buttonKind="ghost"
                size="field"
                labelText={<DocumentImport16 fill="#161616" />}
                onChange={onImport}
                disableLabelChanges
                accepts={['.json']}
                multiple={false}
              />
            </TooltipIcon>
          )
        }
        {onExport && (
          <Button
            kind="ghost"
            size="field"
            iconDescription={mergedI18n.headerExportButton}
            tooltipPosition="bottom"
            tooltipAlignment="center"
            hasIconOnly
            renderIcon={DocumentExport16}
            onClick={() => onExport(dashboardJson)}
          />
        )}
        {onDelete && (
          <Button
            kind="ghost"
            size="field"
            iconDescription={mergedI18n.headerDeleteButton}
            tooltipPosition="bottom"
            tooltipAlignment="center"
            hasIconOnly
            renderIcon={TrashCan16}
            onClick={onDelete}
          />
        )}
        {onCancel && (
          <Button kind="secondary" size="field" onClick={onCancel}>
            {mergedI18n.headerCancelButton}
          </Button>
        )}
        {onBack && (
          <Button kind="secondary" size="field" onClick={onBack}>
            {mergedI18n.headerBackButton}
          </Button>
        )}
        {onSubmit && (
          <Button
            size="field"
            disabled={isSubmitDisabled}
            onClick={() => onSubmit(dashboardJson)}
            loading={isSubmitLoading}
          >
            {mergedI18n.headerSubmitButton}
          </Button>
        )}
      </div>
    </div>
  );

  // handle the edit title button
  const handleEditClick = useCallback(() => {
    setIsTitleEditMode(true);
  }, []);

  const editWidgets = useMemo(
    () => (
      <>
        <TextInput
          size="sm"
          labelText={mergedI18n.dashboardTitleLabel}
          hideLabel
          id="dashboardTitle"
          name="dashboardTitle"
          value={updatedTitle}
          onChange={(e) => {
            setUpdatedTitle(e.target.value);
          }}
          invalidText={isEmpty(updatedTitle) ?? mergedI18n.requiredMessage}
          invalid={isEmpty(updatedTitle)}
        />
        <Button
          kind="ghost"
          size="field"
          title={mergedI18n.headerCancelButton}
          onClick={() => {
            setIsTitleEditMode(false);
            // revert the title back to the original
            setUpdatedTitle(title);
          }}
        >
          {mergedI18n.headerCancelButton}
        </Button>
        <Button
          size="field"
          onClick={() => {
            onEditTitle(updatedTitle);
            setIsTitleEditMode(false);
          }}
        >
          {mergedI18n.saveTitleButton}
        </Button>
      </>
    ),
    [onEditTitle, title, updatedTitle, mergedI18n]
  );

  return (
    <PageTitleBar
      breadcrumb={breadcrumbs}
      extraContent={extraContent}
      title={title}
      editable={!!onEditTitle && !isTitleEditMode}
      renderTitleFunction={isTitleEditMode ? () => editWidgets : null}
      onEdit={handleEditClick}
      i18n={{ editIconDescription: mergedI18n.headerEditTitleButton }}
    />
  );
};

DashboardEditorHeader.defaultProps = defaultProps;
DashboardEditorHeader.propTypes = propTypes;

export default DashboardEditorHeader;
