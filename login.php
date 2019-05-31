<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<!-- Original Authors: Mark Otto, Jacob Thornton, and Bootstrap contributors -->
		<title>GamePlan | Login</title>
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Fredericka+the+Great">
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
		<link rel="stylesheet" href="loginstyle.css">

		<style>
		  .bd-placeholder-img {
			font-size: 1.125rem;
			text-anchor: middle;
		  }

		  @media (min-width: 768px) {
			.bd-placeholder-img-lg {
			  font-size: 3.5rem;
			}
		  }
		</style>
		<!-- Custom styles for this template -->
		<link href="signin.css" rel="stylesheet">
	</head>

	<body class="text-center">
	<form class="form-signin">
	  <img class="mb-4" src="./images/logo.png" alt="" width="72" height="72">
	  <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
	  <label for="inputEmail" class="sr-only">Email address</label>
	  <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
	  <label for="inputPassword" class="sr-only">Password</label>
	  <input type="password" id="inputPassword" class="form-control" placeholder="Password" required>
	  <div class="checkbox mb-3">
		<label>
		  <input type="checkbox" value="remember-me"> Remember me
		</label>
		</div>
		<button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
		<hr>
		<a class="btn btn-sm btn-warning btn-block" href="./patientreg.html" role="button">New Patient? Register here!</a>
		<a class="btn btn-sm btn-outline-info btn-block" href="./forgot.php" role="button">Forgot Password</a>
		<p class="mt-5 mb-3 text-muted">&copy; GamePlan <?php echo date("Y"); ?></p>
	</form>
	</body>
</html>