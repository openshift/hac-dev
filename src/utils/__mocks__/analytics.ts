const { TrackEvents } = jest.requireActual('../analytics');

export { TrackEvents };

const mockTrack = jest.fn();

export const useTrackEvent = () => mockTrack;
