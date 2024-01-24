
const utils = {
	// this function will filter out the repeating events that have been updated
	// it will skip all previous versions, and only show the latest version of the event
	filterUpdatedEvents(events) {
		let latestEvents = {};
		events.forEach(event => {
			let uid = event.UID;
			// id is a unique identifier key to separate event and avoid duplicate keys in the DOM
			event.id = nanoid();
			let newStartDate = new Date(event.startDate);
			let recurrenceId = 0;
			let oldRecurrenceId = 0;
			// check if this event has been seen before
			// the key is the UID + the date of the event
			let storedRecored = latestEvents[uid + `${newStartDate.getDate()}-${newStartDate.getMonth()}-${newStartDate.getFullYear()}`];
    
			for (const key in event) {
				if (key.startsWith('RECURRENCE-ID')) {
					recurrenceId = event[key];
				}
			}
			if (storedRecored) {
				for (const key in storedRecored) {
					if (key.startsWith('RECURRENCE-ID')) {
						oldRecurrenceId = event[key];
					}
				}
			}
    
			// to add the event to the list, it must be the first time we see it
			// or it must be a newer version of the event
			if (!storedRecored
                || (recurrenceId && !oldRecurrenceId)
                || (recurrenceId && oldRecurrenceId && Number(recurrenceId.substr(0, 8)) > Number(oldRecurrenceId.substr(0, 8)) && Number(recurrenceId.substr(9, 15)) > Number(oldRecurrenceId.substr(9, 15)))
			) {
				latestEvents[uid + `${newStartDate.getDate()}-${newStartDate.getMonth()}-${newStartDate.getFullYear()}`] = event;
			}
		});
		// return the values of the object
		return Object.values(latestEvents);
	},
};