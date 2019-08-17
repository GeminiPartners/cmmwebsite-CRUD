# Auth

Add form-based cookie authentication to our sticker-mania app.

### We will have 3 types of users:
* Visitors - can only view the homepage
* Logged In User - can only view the their page
* Admin User - can view any page; can de-activate users;

## Authentication


### Authorization:
* [ ] Visitors cannot edit items
	* [ ] create middleware to redirect visitors without a user_id cookie set
	* [ ] redirect to sign up form and show an error message
* [ ] Logged in users can only edit their items
	* [ ] check user_id cookie in route handler
 	* [ ] show an unauthorized error message
	* [ ] redirect to user page if they visit the homepage

## Admin Page:
* [ ] Admin page that lists all users
	* [ ] admin table with user_id (unique constraint)
	* [ ] de-activate users
* [ ] Admin can see any page on site

## Other ways to auth:
* [ ] Use JWTs instead of sessions!
