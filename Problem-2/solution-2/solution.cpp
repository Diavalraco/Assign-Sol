#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <numeric>

using namespace std;
struct Person {
    string name;
    int amountPaid;
    vector<int> apples;
    int totalWeight = 0;
};

void distributeApples(vector<Person>& people, vector<int>& apples) {
    int totalPayment = accumulate(people.begin(), people.end(), 0, [](int sum, const Person& p) {
        return sum + p.amountPaid;
    });

    int totalWeight = accumulate(apples.begin(), apples.end(), 0);

    vector<double> proportions(people.size());
    for (size_t i = 0; i < people.size(); ++i) {
        proportions[i] = static_cast<double>(people[i].amountPaid) / totalPayment;
    }

    sort(apples.rbegin(), apples.rend());

    for (int apple : apples) {
        int bestPersonIndex = 0;
        double minDifference = numeric_limits<double>::max();

        for (size_t i = 0; i < people.size(); ++i) {
            double idealWeight = proportions[i] * totalWeight;
            double difference = idealWeight - people[i].totalWeight;

            if (difference > 0 && difference < minDifference) {
                minDifference = difference;
                bestPersonIndex = i;
            }
        }

        people[bestPersonIndex].apples.push_back(apple);
        people[bestPersonIndex].totalWeight += apple;
    }
}

int main() {
    int numPeople;
    cout << "Enter the number of people: ";
    cin >> numPeople;

    vector<Person> people(numPeople);

    for (int i = 0; i < numPeople; ++i) {
        cout << "Enter the name of person " << i + 1 << ": ";
        cin >> people[i].name;
        cout << "Enter the amount paid by " << people[i].name << ": ";
        cin >> people[i].amountPaid;
    }

    vector<int> apples;
    cout << "Enter apple weights in grams (-1 to stop): ";
    while (true) {
        int weight;
        cin >> weight;
        if (weight == -1) break;
        apples.push_back(weight);
    }

    distributeApples(people, apples);

    cout << "Distribution Result:" << endl;
    for (const auto& person : people) {
        cout << person.name << ": ";
        for (int weight : person.apples) {
            cout << weight << " ";
        }
        cout << endl;
    }

    return 0;
}
