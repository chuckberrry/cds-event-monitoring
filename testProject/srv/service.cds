using {my.plugin.test as my} from '../db/data-model';

service TestService {
    entity Books   as projection on my.Books;
    entity Authors as projection on my.Authors;
}
