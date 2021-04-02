import React, { useCallback, useContext, useMemo, useState } from 'react';

import { Header } from './Header';
import { Menu } from './Menu';
import SpeakerDetail from './SpeakerDetail';
import { ConfigContext } from './App';
import { GlobalContext } from './GlobalState';

const Speakers = ({}) => {
  const [speakingSaturday, setSpeakingSaturday] = useState(true);
  const [speakingSunday, setSpeakingSunday] = useState(true);
  const context = useContext(ConfigContext);

  const { isLoading, speakerList, toggleSpeakerFavorite, forceUpdateIdentifier, forceUpdate } = useContext(
    GlobalContext,
  );

  console.log(`Speakers: forceUpdateIdentifier:${forceUpdateIdentifier}`);

  const handleChangeSaturday = () => {
    setSpeakingSaturday(!speakingSaturday);
    forceUpdate();
  };
  const handleChangeSunday = () => {
    setSpeakingSunday(!speakingSunday);
    forceUpdate();
  };
  const heartFavoriteHandler = useCallback((e, speakerRec) => {
    e.preventDefault();
    toggleSpeakerFavorite(speakerRec);
  }, []);

  const newSpeakerList = useMemo(
    () =>
      speakerList
        .filter(
          ({ sat, sun }) =>
            (speakingSaturday && sat) || (speakingSunday && sun),
        )
        .sort(function (a, b) {
          if (a.firstName < b.firstName) {
            return -1;
          }
          if (a.firstName > b.firstName) {
            return 1;
          }
          return 0;
        }),
    [speakingSaturday, speakingSunday, speakerList],
  );

  const speakerListFiltered = isLoading ? [] : newSpeakerList;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <Menu />
      <div className="container">
        <div className="btn-toolbar  margintopbottom5 checkbox-bigger">
          {context.showSpeakerSpeakingDays === false ? null : (
            <div className="hide">
              <div className="form-check-inline">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={handleChangeSaturday}
                    checked={speakingSaturday}
                  />
                  Saturday Speakers
                </label>
              </div>
              <div className="form-check-inline">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={handleChangeSunday}
                    checked={speakingSunday}
                  />
                  Sunday Speakers
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="row">
          <div className="card-deck">
            {speakerListFiltered.map((speakerRec) => {
              return (
                <SpeakerDetail
                  key={speakerRec.id}
                  speakerRec={speakerRec}
                  onHeartFavoriteHandler={heartFavoriteHandler}
                  forceUpdateIdentifier={forceUpdateIdentifier}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speakers;
