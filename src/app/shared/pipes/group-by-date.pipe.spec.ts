import * as MomentTZ from 'moment-timezone';

import { GroupByDay } from './group-by-date';


describe('GroupByDayPipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new GroupByDay();

  // Generate initial data for the pipe
  const initialDateForEvent = MomentTZ('2017-03-14 17:00:00');
  const event1 = new Object({ startDate: initialDateForEvent.clone() });
  const event2 = new Object({ startDate: initialDateForEvent.clone().add(1, 'days') });
  const event3 = new Object({ startDate: initialDateForEvent.clone().add(1, 'days').add(1, 'hours') });
  const event4 = new Object({ startDate: initialDateForEvent.clone().add(2, 'days') });
  const eventList = [event1, event2, event3, event4];

  // data to test against results
  const expectedLengths: Array<number> = [
    1, 2, 1
  ];

  const eventsCheckDate: Array<string> = [
    '2017-03-14', '2017-03-15', '2017-03-16'
  ];

  const eventsCheckDateTime: Array<any> = [
    '2017-03-14 17:00:00',
    [ '2017-03-15 17:00:00', '2017-03-15 18:00:00' ],
    '2017-03-16 17:00:00'
  ];

  it('A list of events are grouped by startDate', () => {
    const formatCheckDate = 'YYYY-MM-DD';
    const formatCheckDateTime = 'YYYY-MM-DD HH:mm:ss';
    const pipeResult = pipe.transform( eventList, 'startDate' );
    expect( pipeResult.length ).toEqual(3);
    pipeResult.forEach( ( res, index ) => {
      expect( res.day.format( formatCheckDate )).toEqual( eventsCheckDate[ index ] );
      expect( res.items.length ).toEqual( expectedLengths[ index ] );
      if (index === 1 ) {
        expect( res.items[0].startDate.format( formatCheckDateTime )).toEqual(eventsCheckDateTime[index][0]);
        expect( res.items[1].startDate.format( formatCheckDateTime )).toEqual(eventsCheckDateTime[index][1]);
      } else {
        expect( res.items[0].startDate.format( formatCheckDateTime )).toEqual(eventsCheckDateTime[index]);
      }
    });
  });
});
