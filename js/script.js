var GrillePhoto = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  RecupPhoto: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      jsonp :'jsonp',
      success: function(data) {
        this.setState({data : data.data.children});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.RecupPhoto();
  },
  render: function() {
    document.title = "RedditGallery - "+this.props.url.split("/")[4];
    console.log(this.props.url);
    taille = this.props.taille;
    var photos = this.state.data.map(function (photo) {
      if(typeof photo.data.preview !== 'undefined'){
        lien = photo.data.thumbnail;
        if(lien == "self")
          lien = "http://www1.pcmag.com/media/images/391545-reddit-logo.jpg?thumb=y";
        lienOriginal = photo.data.url;
        titre = photo.data.title
        return (
          <Photo lien={lien} titre={titre} taille={taille} lienOriginal={lienOriginal}/>
        );
      }
    });
    return (
      <div className="grille" data-url={this.props.url} data-size={this.props.taille}>
        {photos}
      </div>
    );
  }
});

var Photo = React.createClass({
  render: function() {
    classNameNomImage = "nomImage "+this.props.taille;
    classNameImage = "image "+this.props.taille;
    return (
      <div className={classNameImage}>
        <a href={this.props.lienOriginal} target="_blank">
          <div className={classNameNomImage}>
            <p><b>{this.props.titre}</b></p>
          </div>
          <img src={this.props.lien} alt={this.props.titre}/>
        </a>
      </div>
    );
  }
});

var Categorie = React.createClass({
  getInitialState: function() {
    return {hide: false};
  },
  handleClick: function(event) {
    show = document.getElementById(this.props.nom).className == 'button';
    for(el in listeBoutons){
        if(listeBoutons[el] != this.props.nom){
            document.getElementById(listeBoutons[el]).className = 'button';
        }
      }
    if(show){
      document.getElementById(this.props.nom).className = 'button selectionne';
      url = document.getElementsByClassName('grille')[0].dataset.url;
      url = url.replace("hot",this.props.nom.toLowerCase());
      url = url.replace("new",this.props.nom.toLowerCase());
      url = url.replace("rising",this.props.nom.toLowerCase());
      url = url.replace("controversial",this.props.nom.toLowerCase());
      url = url.replace("top",this.props.nom.toLowerCase());
      url = url.replace("gilded",this.props.nom.toLowerCase());
      taille = document.getElementsByClassName('grille')[0].dataset.size;
      ReactDOM.unmountComponentAtNode(document.getElementById('content'));
      ReactDOM.render(
        <GrillePhoto url={url} taille={taille}/>,
        document.getElementById('content')
      );
    }
  },
  render: function() {
    return (
      <button className='button' type="button" onClick={this.handleClick} id={this.props.nom}>
        {this.props.nom}
      </button>
    );
  }
});

var BoutonsCategories = React.createClass({
  render: function() {
    var boutons = this.props.boutons.map(function (bouton) {
      return (
        <Categorie nom={bouton}/>
      );
    });
    return (
      <div className="BoutonsCategories">
        {boutons}
      </div>
    );
  }
});

var Taille = React.createClass({
  getInitialState: function() {
    return {hide: false};
  },
  handleClick: function(event) {
    show = document.getElementById(this.props.nom).className == 'button';
    url = document.getElementsByClassName('grille')[0].dataset.url;
    taille = this.props.nom.toLowerCase();
    //console.log(url);
    for(el in listeTailles){
        if(listeTailles[el] != this.props.nom){
            document.getElementById(listeTailles[el]).className = 'button';
        }
      }
    if(show){
      document.getElementById(this.props.nom).className = 'button selectionne';
      ReactDOM.unmountComponentAtNode(document.getElementById('content'));
      ReactDOM.render(
        <GrillePhoto url={url} taille={taille}/>,
        document.getElementById('content')
      );
    }
  },
  render: function() {
    return (
      <button className='button' type="button" onClick={this.handleClick} id={this.props.nom}>
        {this.props.nom}
      </button>
    );
  }
});

var BoutonsTailles = React.createClass({
  render: function() {
    var tailles = this.props.tailles.map(function (taille) {
      return (
        <Taille nom={taille}/>
      );
    });
    return (
      <div className="BoutonsTailles">
        {tailles}
      </div>
    );
  }
});

var ChampRecherche = React.createClass({
  handleKeyDown: function(e) {
            var ENTER = 13;
            if( e.keyCode == ENTER ) {
              url = "https://www.reddit.com/r/"+document.getElementsByName('recherche')[0].value;
              urlGrille = document.getElementsByClassName('grille')[0].dataset.url;
              url = url + urlGrille.substr(urlGrille.lastIndexOf("/"),urlGrille.length);
              taille = document.getElementsByClassName('grille')[0].dataset.size;
              ReactDOM.unmountComponentAtNode(document.getElementById('content'));
              ReactDOM.render(
                <GrillePhoto url={url} taille={taille}/>,
                document.getElementById('content')
              );
            }

        },
  render: function() {
    return (
      <input className="recherche" type="text" name="recherche" onKeyDown={this.handleKeyDown}/>
    );
  }
});

var listeTailles = ["Big","Medium","Small"];
var listeBoutons = ["Hot","New","Rising","Controversial","Top","Gilded"];

var grille = React.createElement(GrillePhoto, {url:"https://www.reddit.com/r/pics/hot.json?limit=100", taille:"medium"});
var boutonsCategories =  React.createElement(BoutonsCategories,{boutons:listeBoutons});
var boutonsTailles =  React.createElement(BoutonsTailles,{tailles:listeTailles});

ReactDOM.render(React.createElement(ChampRecherche),document.getElementById('form'))
ReactDOM.render(boutonsTailles,document.getElementById('listeTaille'));

ReactDOM.render(boutonsCategories,document.getElementById('listeCategories'));
ReactDOM.render(grille, document.getElementById('content'));

document.getElementById("Hot").className = 'button selectionne';
document.getElementById("Medium").className = 'button selectionne';

document.title = "RedditGallery - pics";
