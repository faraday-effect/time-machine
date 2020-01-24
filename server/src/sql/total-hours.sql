-- Report total hours for each account.

select "firstName" || ' ' || "lastName"        as name,
       sum(stop::timestamp - start::timestamp) as duration
from entry
         inner join account on account.id = entry."accountId"
group by name
order by duration;
