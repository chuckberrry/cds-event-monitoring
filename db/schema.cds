namespace cap.plugin.eventmonitoring;

entity EventData {
    key ID        : UUID;
        createdAt : Timestamp   @cds.on.insert: $now  @title: 'Created At';
        data      : LargeString @title        : 'Data' not null;
        topic     : String      @title        : 'Topic' not null;
        dmq       : String      @title        : 'Dead Message Queue';
        hash      : String      @Core.Computed;
}
