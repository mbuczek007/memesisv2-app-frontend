import React, { useState, useEffect } from 'react';
import EntryDataService from '../../services/entry.service';

const Entries = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    EntryDataService.getAllEntries()
      .then((response) => {
        setEntries(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <section>
      <ul>
        {entries &&
          entries.map((entry, index) => (
            <li key={index}>
              <p>
                <strong>Id: </strong>
                {entry.entry_id}
              </p>
              <p>
                <strong>Title: </strong>
                {entry.title}
              </p>
              <p>
                <strong>Description: </strong>
                {entry.description}
              </p>
              <p>
                <strong>Nick: </strong>
                {entry.nick_name}
              </p>
              <p>
                <strong>Source: </strong>
                {entry.source}
              </p>
              <p>
                <strong>Created date: </strong>
                {entry.created_date}
              </p>
            </li>
          ))}
      </ul>
    </section>
  );
};

export default Entries;
