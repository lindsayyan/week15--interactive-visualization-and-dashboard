# 1. import Flask
import pandas as pd
from flask import Flask, jsonify, request 
Belly_Button_Biodiversity_Metadata=pd.read_csv('data/Belly_Button_Biodiversity_Metadata.csv')
belly_button_biodiversity_otu_id=pd.read_csv('data/belly_button_biodiversity_otu_id.csv')
belly_button_biodiversity_samples=pd.read_csv('data/belly_button_biodiversity_samples.csv')
metadata_columns=pd.read_csv('data/metadata_columns.csv')


# 2. Create an app, being sure to pass __name__
app = Flask(__name__)


# 3. Define what to do when a user hits the index route
# @app.route("/")
# def home():
#     print("Server received request for 'Home' page...")
#     return "Welcome to my 'Home' page!"

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Avalable Routes:<br/><br/><br/>"

        f"/names<br/>"
        f"- List of Sample Names<br/>"
        f"<br/>"

        f"/otu<br/>"
        f"- List of OTU descriptions<br/>"
        f"<br/>"

        f"/metadata/[input]<br/>"
        f"- Check the details of a sample<br/>"
        f"<br/>"

        f"/wfreq/[input]<br/>"
        f"- Check the weekly washing frequency of a sample<br/>"
        f"<br/>"


        f"/sample/[input]<br/>"
        f"- Check the top 10 sample values of each sample<br/>"
        f"<br/>"
        )
# 4. Define what to do when a user hits the /about route
# @app.route("/about")
# def about():
#     print("Server received request for 'About' page...")
#     return "Welcome to my 'About' page!"



@app.route('/names')
def names():

    list_names = belly_button_biodiversity_samples.columns.tolist()
    df = pd.DataFrame(list_names[1:], columns=['list_names'])
    return jsonify(df.to_dict(orient="list")['list_names'])   

@app.route('/otu')
def otu():

    otu_list=belly_button_biodiversity_otu_id.loc[:,'lowest_taxonomic_unit_found'].tolist()
    df_otu = pd.DataFrame(otu_list, columns=['otu_list'])
    return jsonify(df_otu.to_dict(orient="list")['otu_list'])
 


@app.route('/metadata/<sample>')
def metadata(sample):
 
    # input1=sample
    out=Belly_Button_Biodiversity_Metadata[Belly_Button_Biodiversity_Metadata['SAMPLEID']==float(sample.split('_')[1])]
    out2=out.T
    out2.columns=['records']
    return jsonify(out2.to_dict(orient="dict")['records'])


@app.route('/wfreq/<sample>')
def wfreq(sample):
    WFREQ=Belly_Button_Biodiversity_Metadata[Belly_Button_Biodiversity_Metadata['SAMPLEID']==float(sample.split('_')[1])]['WFREQ']
    return jsonify(pd.DataFrame(WFREQ).to_dict(orient="lists")['WFREQ'])



@app.route('/sample/<sample_name>')
def sample(sample_name):
    sample2=belly_button_biodiversity_samples.sort_values(by=sample_name,ascending=False)[[sample_name]][0:10]
    otu_id=belly_button_biodiversity_samples.sort_values(by=sample_name,ascending=False)[['otu_id']][0:10]
    output=pd.concat([otu_id,sample2],axis=1)
    return jsonify([output.to_dict(orient="lists")])

if __name__ == "__main__":
    app.run(debug=True)
