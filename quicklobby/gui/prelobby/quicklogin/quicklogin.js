 function showNormalLogin()
  {
  	if (Engine.HasXmppClient())
  		Engine.StopXmppClient();

  	Engine.SwitchGuiPage("page_prelobby_login.xml");
  }

  function init()
  {
  	g_LobbyMessages.connected = onLogin;
  	g_LobbyMessages.error = showNormalLogin;
  	g_LobbyMessages.disconnected = showNormalLogin;

  	const username = Engine.ConfigDB_GetValue("user", "lobby.login");
  	const password = Engine.ConfigDB_GetValue("user", "lobby.password");

  	Engine.GetGUIObjectByName("username").caption = username;
  	Engine.GetGUIObjectByName("password").caption = password.substr(0, 10);

  	initLobbyTerms();
  	updateFeedback();

  	if (username && password && !checkTerms())
  		continueButton();
  	else
  		showNormalLogin();

  	return cancelButton();
  }

  function updateFeedback()
  {
  	setFeedback(checkUsername(false) || checkPassword(false) || checkTerms());
  }

  function onUsernameEdit()
  {
  	loadTermsAcceptance();
  	updateFeedback();
  }

  function continueButton()
  {
  	setFeedback(translate("Connecting…"));

  	Engine.StartXmppClient(
  		Engine.GetGUIObjectByName("username").caption,
  		getEncryptedPassword(),
  		Engine.ConfigDB_GetValue("user", "lobby.room"),
  		Engine.GetGUIObjectByName("username").caption,
  		+Engine.ConfigDB_GetValue("user", "lobby.history"));

  	Engine.ConnectXmppClient();
  }

  function onLogin()
  {
  	saveCredentials();

  	Engine.SwitchGuiPage("page_lobby.xml", {
  		"dialog": false
  	});
  	Engine.SendGetBoardList();
  }

