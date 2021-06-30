import pickle as pickle
from flask import Flask
app = Flask(__name__)

# load the saved model
file_name = 'underwritingModel.sav'
loaded_model = pickle.load(open(file_name, 'rb'))

'''
get_risk_factor method
'''
@app.route("/getRiskFactor")
def get_risk_factor(age, is_overweight, has_ped, has_ped2, is_smoking, is_alcoholic, has_undergone_procedure):
    risk_factor = loaded_model.predict([[age, is_overweight, has_ped, has_ped2, is_smoking, is_alcoholic, has_undergone_procedure]])
    return risk_factor[0]

'''
ping method
'''
@app.route("/")
def ping():
    return 'hello, working.'

if __name__ == '__main__':
   app.run()