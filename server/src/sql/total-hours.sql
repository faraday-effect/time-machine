-- Report total hours for each account.

select "firstName" || ' ' || "lastName"        as name,
       sum(stop::timestamp - start::timestamp) as duration
from entry
         inner join account on account.id = entry."accountId"
group by name
order by duration;


-- Total hours per project
select title, sum(stop::timestamp - start::timestamp) as duration
from entry
         inner join project on entry."projectId" = project.id
group by title
order by duration;
