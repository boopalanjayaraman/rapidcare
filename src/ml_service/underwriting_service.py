import pickle as pickle
from flask import Flask
from flask import request

app = Flask(__name__)

# load the saved model
file_name = 'underwritingModel.sav'
loaded_model = pickle.load(open(file_name, 'rb'))

'''
get_risk_factor method
'''
@app.route("/getRiskFactor")
def get_risk_factor():
    
    age = int(request.args['age'])
    is_overweight = int(request.args['is_overweight'])
    has_ped = int(request.args['has_ped'])
    has_ped2 = int(request.args['has_ped2'])
    is_smoking = int(request.args['is_smoking'])
    is_alcoholic = int(request.args['is_alcoholic'])
    has_undergone_procedure = int(request.args['has_undergone_procedure'])


    risk_factor = loaded_model.predict([[age, is_overweight, has_ped, has_ped2, is_smoking, is_alcoholic, has_undergone_procedure]])
    return dict({"risk_factor": risk_factor[0]})

'''
ping method
'''
@app.route("/")
def ping():
    return 'hello, working.'

if __name__ == '__main__':
   app.run()