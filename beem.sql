/**Script for top 3 orders**/

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SELECT o.order_id,u.name,c.campaign_name,o.total
FROM orders o 
JOIN users u 
ON o.user_id=u.user_id 
JOIN campaigns c 
ON c.campaign_id=u.campaign_id
ORDER BY o.total DESC LIMIT 3;
/**Script for top 3 camapigns**/

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SELECT c.campaign_name,SUM(o.total) AS revenue
FROM campaigns c 
JOIN users u 
ON c.campaign_id=u.campaign_id
JOIN orders o 
ON o.user_id=u.user_id 
ORDER BY SUM(o.total) DESC  LIMIT 3;
