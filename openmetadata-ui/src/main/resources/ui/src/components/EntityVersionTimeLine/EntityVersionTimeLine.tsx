import classNames from 'classnames';
import { capitalize, toString } from 'lodash';
import React, { Fragment, useState } from 'react';
import { versionTypes } from '../../constants/constants';
import { EntityHistory } from '../../generated/type/entityHistory';
import { getSummary, isMajorVersion } from '../../utils/EntityVersionUtils';
import { dropdownIcon as DropDownIcon } from '../../utils/svgconstant';
import { Button } from '../buttons/Button/Button';
import DropDownList from '../dropdown/DropDownList';

type Props = {
  versionList: EntityHistory;
  currentVersion: string;
  show?: boolean;
  versionHandler: (v: string) => void;
  onBack: () => void;
};
type VersionType = 'all' | 'major' | 'minor';

const EntityVersionTimeLine: React.FC<Props> = ({
  versionList = {} as EntityHistory,
  currentVersion,
  show = false,
  versionHandler,
  onBack,
}: Props) => {
  const [listVisible, setListVisible] = useState(false);
  const [versionType, setVersionType] = useState<VersionType>('all');
  const getVersionList = () => {
    let versionTypeList = [];
    const list = versionList.versions ?? [];

    switch (versionType) {
      case 'major':
        versionTypeList = list.filter((v) => {
          const currV = JSON.parse(v);

          return isMajorVersion(
            parseFloat(currV?.changeDescription?.previousVersion)
              .toFixed(1)
              .toString(),
            parseFloat(currV?.version).toFixed(1).toString()
          );
        });

        break;
      case 'minor':
        versionTypeList = list.filter((v) => {
          const currV = JSON.parse(v);

          return !isMajorVersion(
            parseFloat(currV?.changeDescription?.previousVersion)
              .toFixed(1)
              .toString(),
            parseFloat(currV?.version).toFixed(1).toString()
          );
        });

        break;
      case 'all':
      default:
        versionTypeList = list;

        break;
    }

    return versionTypeList.length ? (
      versionTypeList.map((v, i) => {
        const currV = JSON.parse(v);
        const majorVersionChecks = () => {
          return (
            isMajorVersion(
              parseFloat(currV?.changeDescription?.previousVersion)
                .toFixed(1)
                .toString(),
              parseFloat(currV?.version).toFixed(1).toString()
            ) && versionType === 'all'
          );
        };

        return (
          <Fragment key={i}>
            {i === 0 ? (
              <div className="timeline-content tw-cursor-pointer tw--mb-2.5">
                <div className="timeline-wrapper">
                  <span className="timeline-line-se" />
                </div>
              </div>
            ) : null}
            <div
              className="timeline-content tw-py-2 tw-cursor-pointer"
              onClick={() => versionHandler(toString(currV?.version))}>
              <div className="timeline-wrapper">
                <span
                  className={classNames('timeline-rounder', {
                    selected: toString(currV?.version) === currentVersion,
                  })}
                  data-testid="select-version"
                />
                <span className={classNames('timeline-line')} />
              </div>
              <div className="tw-grid tw-gap-0.5">
                <p
                  className={classNames('tw-text-grey-body tw-font-normal', {
                    'tw-text-primary-active':
                      toString(currV?.version) === currentVersion,
                  })}>
                  <span>v{parseFloat(currV?.version).toFixed(1)}</span>
                  {majorVersionChecks() ? (
                    <span className="tw-ml-2 tw-text-xs tw-font-normal tw-text-grey-body tw-bg-tag tw-px-2 tw-py-0.5 tw-rounded">
                      Major
                    </span>
                  ) : null}
                </p>
                <div className="tw-text-xs tw-font-normal tw-break-all">
                  {getSummary(currV?.changeDescription)}
                </div>
                <p className="tw-text-xs tw-italic">
                  <span className="tw-font-normal">{currV?.updatedBy}</span>
                  <span className="tw-text-grey-muted"> updated on </span>
                  <span className="tw-font-normal">
                    {new Date(currV?.updatedAt).toLocaleDateString('en-CA', {
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </span>
                </p>
              </div>
            </div>
          </Fragment>
        );
      })
    ) : (
      <p className="tw-text-grey-muted tw-flex tw-justify-center tw-items-center tw-mt-10">
        {`No ${capitalize(versionType)} versions available`}
      </p>
    );
  };

  const handleVersionTypeSelection = (
    _e: React.MouseEvent<HTMLElement, MouseEvent>,
    value?: string
  ) => {
    if (value) {
      setVersionType(value as VersionType);
    }
    setListVisible(false);
  };

  return (
    <div className={classNames('timeline-drawer', { open: show })}>
      <header className="tw-flex tw-justify-between">
        <div className="tw-flex">
          <p className="tw-font-medium tw-mr-2">Versions History</p>
          <Button
            className="tw-bg-primary-hover-lite tw-px-2 tw-rounded"
            data-testid="versiontype-dropdown"
            size="custom"
            theme="primary"
            variant="text"
            onClick={() => setListVisible((visible) => !visible)}>
            {capitalize(versionType)}
            <DropDownIcon style={{ marginTop: '2px', height: '15px' }} />
          </Button>
          {listVisible && (
            <DropDownList
              className="tw-ml-24 tw-top-11"
              dropDownList={versionTypes}
              value={versionType}
              onSelect={handleVersionTypeSelection}
            />
          )}
        </div>
        <div className="tw-flex" onClick={onBack}>
          <svg
            className="tw-w-5 tw-h-5 tw-ml-1 tw-cursor-pointer"
            data-testid="closeDrawer"
            fill="none"
            stroke="#6B7280"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 18L18 6M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
      </header>
      <hr className="tw-mt-3 tw-border-primary-hover-lite" />

      <div className="tw-my-2 tw-pb-9">{getVersionList()}</div>
    </div>
  );
};

export default EntityVersionTimeLine;