-- Phase 2: seed subjects and companies (idempotent)

insert into public.subjects (slug, name, icon, description) values
  ('computer-networks','Computer Networks','Network','OSI, TCP/IP, routing, and protocols.'),
  ('dbms','DBMS','Database','Relational models, SQL, normalization, transactions.'),
  ('operating-system','Operating System','Cpu','Processes, scheduling, memory, deadlocks.'),
  ('oops','OOPs','Boxes','Encapsulation, inheritance, polymorphism, abstraction.'),
  ('java','Java','Coffee','Core Java, collections, JVM, concurrency.'),
  ('python','Python','Code','Python language, libraries, problem solving.'),
  ('c-programming','C Programming','Terminal','C fundamentals, pointers, memory.'),
  ('data-structures','Data Structures','GitBranch','Arrays, lists, trees, graphs, hashing.'),
  ('algorithms','Algorithms','Activity','Sorting, searching, DP, greedy, graphs.'),
  ('aptitude','Aptitude','Calculator','Quantitative, logical, and verbal aptitude.')
on conflict (slug) do nothing;

insert into public.companies (slug, name, description) values
  ('tcs','TCS','TCS NQT and placement preparation.'),
  ('infosys','Infosys','Infosys recruitment preparation.'),
  ('wipro','Wipro','Wipro Elite/Turbo preparation.'),
  ('accenture','Accenture','Accenture placement preparation.'),
  ('cognizant','Cognizant','Cognizant GenC preparation.'),
  ('capgemini','Capgemini','Capgemini placement preparation.'),
  ('ibm','IBM','IBM placement preparation.'),
  ('hcl','HCL','HCL placement preparation.'),
  ('amazon','Amazon','Amazon SDE preparation.'),
  ('google','Google','Google SWE preparation.'),
  ('microsoft','Microsoft','Microsoft SDE preparation.')
on conflict (slug) do nothing;
